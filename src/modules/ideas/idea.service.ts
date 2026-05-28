import mongoose from 'mongoose';
import { Idea, IIdea } from './idea.model';
import { IdeaVersion } from './ideaVersion.model';
import { ActivityLog } from '../activity/activity.model';
import { ApiError } from '../../utils/apiError';
import { ActivityAction } from '../../types';
import { PaginationOptions, getPaginationMeta } from '../../utils/pagination';

/**
 * Idea Service
 * Handles hierarchical idea CRUD, tree operations, and version tracking.
 *
 * Tree strategy: parent reference + materialized path
 * - Path format: ",ancestorId1,ancestorId2,...,thisId,"
 * - Allows finding all descendants with a single regex query
 */
export class IdeaService {
  /**
   * Create a new idea, optionally as a child of another idea.
   * Automatically computes path and depth from parent.
   */
  static async create(
    data: { title: string; content?: string; sessionId: string; parentIdeaId?: string; tags?: string[] },
    userId: string
  ) {
    let path = '';
    let depth = 0;
    let position = 0;

    // If this is a child idea, compute path from parent
    if (data.parentIdeaId) {
      const parent = await Idea.findById(data.parentIdeaId);
      if (!parent) throw ApiError.notFound('Parent idea not found');
      if (parent.session.toString() !== data.sessionId) {
        throw ApiError.badRequest('Parent idea belongs to a different session');
      }
      depth = parent.depth + 1;
      // Position = count of existing siblings
      position = await Idea.countDocuments({
        parentIdea: data.parentIdeaId,
        isDeleted: false,
      });
    } else {
      // Root-level idea
      position = await Idea.countDocuments({
        session: data.sessionId,
        parentIdea: null,
        isDeleted: false,
      });
    }

    const idea = await Idea.create({
      title: data.title,
      content: data.content || '',
      session: data.sessionId,
      author: userId,
      parentIdea: data.parentIdeaId || null,
      depth,
      position,
      tags: data.tags || [],
    });

    // Build materialized path after we have the _id
    if (data.parentIdeaId) {
      const parent = await Idea.findById(data.parentIdeaId);
      idea.path = `${parent!.path}${idea._id},`;
    } else {
      idea.path = `,${idea._id},`;
    }
    await idea.save();

    // Create initial version snapshot
    await IdeaVersion.create({
      idea: idea._id,
      version: 1,
      title: idea.title,
      content: idea.content,
      editedBy: userId,
      changeNote: 'Initial creation',
    });

    // Log activity
    await ActivityLog.create({
      session: data.sessionId,
      user: userId,
      action: ActivityAction.IDEA_CREATED,
      targetType: 'Idea',
      targetId: idea._id,
      metadata: { title: idea.title, parentIdea: data.parentIdeaId },
    });

    return idea.populate('author', 'name email');
  }

  /**
   * Update an idea's content. Creates a new version snapshot.
   */
  static async update(
    ideaId: string,
    data: { title?: string; content?: string; tags?: string[]; changeNote?: string },
    userId: string
  ) {
    const idea = await Idea.findById(ideaId);
    if (!idea) throw ApiError.notFound('Idea not found');
    if (idea.isDeleted) throw ApiError.badRequest('Cannot update a deleted idea');

    // Apply updates
    if (data.title !== undefined) idea.title = data.title;
    if (data.content !== undefined) idea.content = data.content;
    if (data.tags !== undefined) idea.tags = data.tags;
    idea.currentVersion += 1;
    await idea.save();

    // Snapshot the new version
    await IdeaVersion.create({
      idea: idea._id,
      version: idea.currentVersion,
      title: idea.title,
      content: idea.content,
      editedBy: userId,
      changeNote: data.changeNote || '',
    });

    // Log activity
    await ActivityLog.create({
      session: idea.session,
      user: userId,
      action: ActivityAction.IDEA_UPDATED,
      targetType: 'Idea',
      targetId: idea._id,
      metadata: { version: idea.currentVersion },
    });

    return idea.populate('author', 'name email');
  }

  /**
   * Soft-delete an idea (and optionally its descendants).
   */
  static async delete(ideaId: string, userId: string) {
    const idea = await Idea.findById(ideaId);
    if (!idea) throw ApiError.notFound('Idea not found');

    // Soft-delete this idea and all descendants (using materialized path)
    await Idea.updateMany(
      { path: { $regex: `,${ideaId},` } },
      { isDeleted: true }
    );

    // Also mark the idea itself
    idea.isDeleted = true;
    await idea.save();

    await ActivityLog.create({
      session: idea.session,
      user: userId,
      action: ActivityAction.IDEA_DELETED,
      targetType: 'Idea',
      targetId: idea._id,
    });

    return idea;
  }

  /**
   * Move an idea to a new parent (or make it a root).
   * Recalculates paths for the entire subtree.
   */
  static async move(ideaId: string, newParentId: string | null, userId: string) {
    const idea = await Idea.findById(ideaId);
    if (!idea) throw ApiError.notFound('Idea not found');

    const oldPath = idea.path;
    let newPath: string;
    let newDepth: number;

    if (newParentId) {
      const newParent = await Idea.findById(newParentId);
      if (!newParent) throw ApiError.notFound('New parent idea not found');

      // Prevent moving a parent under its own descendant
      if (newParent.path.includes(`,${ideaId},`)) {
        throw ApiError.badRequest('Cannot move an idea under its own descendant');
      }

      newPath = `${newParent.path}${ideaId},`;
      newDepth = newParent.depth + 1;
    } else {
      newPath = `,${ideaId},`;
      newDepth = 0;
    }

    // Update this idea
    const depthDiff = newDepth - idea.depth;
    idea.parentIdea = newParentId ? new mongoose.Types.ObjectId(newParentId) : null;
    idea.path = newPath;
    idea.depth = newDepth;
    await idea.save();

    // Update all descendants' paths and depths
    const descendants = await Idea.find({
      path: { $regex: new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '.+') },
      _id: { $ne: idea._id },
    });

    for (const desc of descendants) {
      desc.path = desc.path.replace(oldPath, newPath);
      desc.depth += depthDiff;
      await desc.save();
    }

    await ActivityLog.create({
      session: idea.session,
      user: userId,
      action: ActivityAction.IDEA_MOVED,
      targetType: 'Idea',
      targetId: idea._id,
      metadata: { newParentId },
    });

    return idea;
  }

  /**
   * Get the full idea tree for a session.
   * Returns flat list; client can rebuild hierarchy from parentIdea references.
   */
  static async getHierarchy(sessionId: string) {
    const ideas = await Idea.find({ session: sessionId, isDeleted: false })
      .populate('author', 'name email')
      .sort({ depth: 1, position: 1 });

    return ideas;
  }

  /**
   * Get children of a specific idea.
   */
  static async getChildren(ideaId: string) {
    return Idea.find({ parentIdea: ideaId, isDeleted: false })
      .populate('author', 'name email')
      .sort({ position: 1 });
  }

  /**
   * Get version history for an idea.
   */
  static async getVersionHistory(ideaId: string) {
    return IdeaVersion.find({ idea: ideaId })
      .populate('editedBy', 'name email')
      .sort({ version: -1 });
  }

  /**
   * Restore an idea to a previous version.
   */
  static async restoreVersion(ideaId: string, versionNumber: number, userId: string) {
    const version = await IdeaVersion.findOne({ idea: ideaId, version: versionNumber });
    if (!version) throw ApiError.notFound('Version not found');

    const idea = await Idea.findById(ideaId);
    if (!idea) throw ApiError.notFound('Idea not found');

    idea.title = version.title;
    idea.content = version.content;
    idea.currentVersion += 1;
    await idea.save();

    // Create a new version entry for the restoration
    await IdeaVersion.create({
      idea: idea._id,
      version: idea.currentVersion,
      title: idea.title,
      content: idea.content,
      editedBy: userId,
      changeNote: `Restored from version ${versionNumber}`,
    });

    await ActivityLog.create({
      session: idea.session,
      user: userId,
      action: ActivityAction.IDEA_RESTORED,
      targetType: 'Idea',
      targetId: idea._id,
      metadata: { restoredFromVersion: versionNumber },
    });

    return idea;
  }

  /**
   * Search ideas by title/content/tags within a session.
   */
  static async search(sessionId: string, query: string, pagination: PaginationOptions) {
    const filter: any = {
      session: sessionId,
      isDeleted: false,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    };

    const [ideas, total] = await Promise.all([
      Idea.find(filter)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit),
      Idea.countDocuments(filter),
    ]);

    return { ideas, pagination: getPaginationMeta(total, pagination) };
  }
}
