import { Workspace, IWorkspace } from './workspace.model';
import { User } from '../users/user.model';
import { ApiError } from '../../utils/apiError';
import { UserRole } from '../../types';

/**
 * Workspace Service — business logic for workspace operations.
 */
export class WorkspaceService {
  /** Create a new workspace. Creator becomes the owner. */
  static async create(data: { name: string; description?: string }, userId: string) {
    const workspace = await Workspace.create({
      name: data.name,
      description: data.description || '',
      owner: userId,
      members: [{ user: userId, role: UserRole.WORKSPACE_ADMIN, joinedAt: new Date() }],
    });
    return workspace.populate('owner', 'name email');
  }

  /** Get all workspaces for a user (as owner or member). */
  static async getUserWorkspaces(userId: string) {
    return Workspace.find({
      $or: [{ owner: userId }, { 'members.user': userId }],
      isActive: true,
    })
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
      .sort({ updatedAt: -1 });
  }

  /** Get workspace by ID with member details. */
  static async getById(workspaceId: string) {
    const workspace = await Workspace.findById(workspaceId)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!workspace) throw ApiError.notFound('Workspace not found');
    return workspace;
  }

  /** Update workspace details. */
  static async update(workspaceId: string, data: { name?: string; description?: string }) {
    const workspace = await Workspace.findByIdAndUpdate(workspaceId, data, {
      new: true,
      runValidators: true,
    });
    if (!workspace) throw ApiError.notFound('Workspace not found');
    return workspace;
  }

  /** Invite a user by email. */
  static async inviteUser(
    workspaceId: string,
    email: string,
    role: UserRole = UserRole.PARTICIPANT
  ) {
    const user = await User.findOne({ email });
    if (!user) throw ApiError.notFound('User with this email not found');

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw ApiError.notFound('Workspace not found');

    // Check if user is already a member
    const existing = workspace.members.find((m) => m.user.toString() === (user._id as any).toString());
    if (existing) throw ApiError.conflict('User is already a member');

    workspace.members.push({ user: user._id as any, role, joinedAt: new Date() });
    await workspace.save();

    return workspace.populate('members.user', 'name email');
  }

  /** Assign/change role for an existing member. */
  static async assignRole(workspaceId: string, userId: string, role: UserRole) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw ApiError.notFound('Workspace not found');

    const member = workspace.members.find((m) => m.user.toString() === userId);
    if (!member) throw ApiError.notFound('User is not a member of this workspace');

    member.role = role;
    await workspace.save();

    return workspace.populate('members.user', 'name email');
  }

  /** Remove a member from the workspace. */
  static async removeMember(workspaceId: string, userId: string) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw ApiError.notFound('Workspace not found');

    if (workspace.owner.toString() === userId) {
      throw ApiError.badRequest('Cannot remove the workspace owner');
    }

    workspace.members = workspace.members.filter((m) => m.user.toString() !== userId);
    await workspace.save();

    return workspace;
  }

  /** Soft-delete a workspace. */
  static async delete(workspaceId: string) {
    const workspace = await Workspace.findByIdAndUpdate(
      workspaceId,
      { isActive: false },
      { new: true }
    );
    if (!workspace) throw ApiError.notFound('Workspace not found');
    return workspace;
  }
}
