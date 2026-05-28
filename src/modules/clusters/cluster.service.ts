import { Cluster } from './cluster.model';
import { ActivityLog } from '../activity/activity.model';
import { ApiError } from '../../utils/apiError';
import { ActivityAction } from '../../types';

/**
 * Cluster Service — group related ideas together.
 */
export class ClusterService {
  /** Create a new cluster. */
  static async create(
    data: { name: string; description?: string; sessionId: string; tags?: string[]; color?: string; ideaIds?: string[] },
    userId: string
  ) {
    const cluster = await Cluster.create({
      name: data.name,
      description: data.description || '',
      session: data.sessionId,
      tags: data.tags || [],
      color: data.color,
      ideas: data.ideaIds || [],
      createdBy: userId,
    });

    await ActivityLog.create({
      session: data.sessionId,
      user: userId,
      action: ActivityAction.CLUSTER_CREATED,
      targetType: 'Cluster',
      targetId: cluster._id,
    });

    return cluster.populate('ideas', 'title content');
  }

  /** Get all clusters for a session. */
  static async getBySession(sessionId: string) {
    return Cluster.find({ session: sessionId })
      .populate('ideas', 'title content tags upvoteCount')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
  }

  /** Update cluster details. */
  static async update(clusterId: string, data: any, userId: string) {
    const cluster = await Cluster.findByIdAndUpdate(clusterId, data, {
      new: true,
      runValidators: true,
    }).populate('ideas', 'title content');

    if (!cluster) throw ApiError.notFound('Cluster not found');

    await ActivityLog.create({
      session: cluster.session,
      user: userId,
      action: ActivityAction.CLUSTER_UPDATED,
      targetType: 'Cluster',
      targetId: cluster._id,
    });

    return cluster;
  }

  /** Assign ideas to a cluster. */
  static async assignIdeas(clusterId: string, ideaIds: string[], userId: string) {
    const cluster = await Cluster.findById(clusterId);
    if (!cluster) throw ApiError.notFound('Cluster not found');

    // Add new ideas without duplicates
    const existingIds = cluster.ideas.map((id) => id.toString());
    const newIds = ideaIds.filter((id) => !existingIds.includes(id));
    cluster.ideas.push(...(newIds as any[]));
    await cluster.save();

    return cluster.populate('ideas', 'title content');
  }

  /** Remove ideas from a cluster. */
  static async removeIdeas(clusterId: string, ideaIds: string[]) {
    const cluster = await Cluster.findById(clusterId);
    if (!cluster) throw ApiError.notFound('Cluster not found');

    cluster.ideas = cluster.ideas.filter((id) => !ideaIds.includes(id.toString()));
    await cluster.save();

    return cluster.populate('ideas', 'title content');
  }

  /** Delete a cluster. */
  static async delete(clusterId: string, userId: string) {
    const cluster = await Cluster.findByIdAndDelete(clusterId);
    if (!cluster) throw ApiError.notFound('Cluster not found');

    await ActivityLog.create({
      session: cluster.session,
      user: userId,
      action: ActivityAction.CLUSTER_DELETED,
      targetType: 'Cluster',
      targetId: cluster._id,
    });

    return cluster;
  }
}
