import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types';
import { ApiError } from '../utils/apiError';
import { Workspace } from '../modules/workspaces/workspace.model';
import { Board } from '../modules/boards/board.model';
import { Session } from '../modules/sessions/session.model';
import { Idea } from '../modules/ideas/idea.model';
import { Cluster } from '../modules/clusters/cluster.model';

/**
 * Role-Based Access Control Middleware
 *
 * Two types of authorization:
 * 1. requireRole() — checks workspace-level role
 * 2. requireAnyRole() — checks if user has ANY of the specified roles in the workspace
 */

/**
 * Checks if the authenticated user has the required role in the workspace
 * specified by :workspaceId param.
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const workspaceId = req.params.workspaceId || req.body.workspaceId;

      if (!workspaceId) {
        throw ApiError.badRequest('Workspace ID is required');
      }

      const workspace = await Workspace.findById(workspaceId);

      if (!workspace) {
        throw ApiError.notFound('Workspace not found');
      }

      // Owner always has full access
      if (workspace.owner.toString() === req.user.id) {
        return next();
      }

      // Find the member entry and check their role
      const member = workspace.members.find(
        (m) => m.user.toString() === req.user!.id
      );

      if (!member) {
        throw ApiError.forbidden('You are not a member of this workspace');
      }

      if (!allowedRoles.includes(member.role)) {
        throw ApiError.forbidden(
          `Requires one of the following roles: ${allowedRoles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Simple role check — verifies user is at least a member of the workspace.
 */
export const requireMembership = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const workspaceId = req.params.workspaceId || req.body.workspaceId;

    if (!workspaceId) {
      throw ApiError.badRequest('Workspace ID is required');
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    const isMember =
      workspace.owner.toString() === req.user.id ||
      workspace.members.some((m) => m.user.toString() === req.user!.id);

    if (!isMember) {
      throw ApiError.forbidden('You are not a member of this workspace');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Checks if the authenticated user is a member of the workspace the board belongs to.
 */
export const requireBoardMembership = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const boardId = req.params.boardId || req.body.boardId;

    if (!boardId) {
      throw ApiError.badRequest('Board ID is required');
    }

    const board = await Board.findById(boardId);

    if (!board) {
      throw ApiError.notFound('Board not found');
    }

    const workspace = await Workspace.findById(board.workspace);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    const isMember =
      workspace.owner.toString() === req.user.id ||
      workspace.members.some((m) => m.user.toString() === req.user!.id);

    if (!isMember) {
      throw ApiError.forbidden('You are not a member of this workspace');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Checks if the user has specific roles in the workspace the board belongs to.
 */
export const requireBoardRole = (...allowedRoles: UserRole[]) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const boardId = req.params.boardId || req.body.boardId;

      if (!boardId) {
        throw ApiError.badRequest('Board ID is required');
      }

      const board = await Board.findById(boardId);

      if (!board) {
        throw ApiError.notFound('Board not found');
      }

      const workspace = await Workspace.findById(board.workspace);

      if (!workspace) {
        throw ApiError.notFound('Workspace not found');
      }

      // Owner always has full access
      if (workspace.owner.toString() === req.user.id) {
        return next();
      }

      const member = workspace.members.find(
        (m) => m.user.toString() === req.user!.id
      );

      if (!member) {
        throw ApiError.forbidden('You are not a member of this workspace');
      }

      if (!allowedRoles.includes(member.role)) {
        throw ApiError.forbidden(
          `Requires one of the following roles: ${allowedRoles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Checks if the user is the board owner, or a workspace admin/facilitator.
 */
export const requireBoardOwnerOrFacilitator = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const boardId = req.params.boardId || req.body.boardId;

    if (!boardId) {
      throw ApiError.badRequest('Board ID is required');
    }

    const board = await Board.findById(boardId);

    if (!board) {
      throw ApiError.notFound('Board not found');
    }

    if (board.createdBy.toString() === req.user.id) {
      return next();
    }

    const workspace = await Workspace.findById(board.workspace);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    if (workspace.owner.toString() === req.user.id) {
      return next();
    }

    const member = workspace.members.find(
      (m) => m.user.toString() === req.user!.id
    );

    if (!member) {
      throw ApiError.forbidden('You are not a member of this workspace');
    }

    if ([UserRole.WORKSPACE_ADMIN, UserRole.FACILITATOR].includes(member.role)) {
      return next();
    }

    throw ApiError.forbidden('Only the board owner or facilitator can perform this action');
  } catch (error) {
    next(error);
  }
};

/**
 * Checks if the authenticated user is a member of the workspace the session belongs to.
 */
export const requireSessionMembership = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const sessionId = req.params.sessionId || req.body.sessionId;

    if (!sessionId) {
      throw ApiError.badRequest('Session ID is required');
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      throw ApiError.notFound('Session not found');
    }

    const workspace = await Workspace.findById(session.workspace);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    const isMember =
      workspace.owner.toString() === req.user.id ||
      workspace.members.some((m) => m.user.toString() === req.user!.id);

    if (!isMember) {
      throw ApiError.forbidden('You are not a member of this workspace');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Checks if the user has specific roles in the workspace the session belongs to.
 */
export const requireSessionRole = (...allowedRoles: UserRole[]) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const sessionId = req.params.sessionId || req.body.sessionId;

      if (!sessionId) {
        throw ApiError.badRequest('Session ID is required');
      }

      const session = await Session.findById(sessionId);

      if (!session) {
        throw ApiError.notFound('Session not found');
      }

      const workspace = await Workspace.findById(session.workspace);

      if (!workspace) {
        throw ApiError.notFound('Workspace not found');
      }

      // Owner always has full access
      if (workspace.owner.toString() === req.user.id) {
        return next();
      }

      const member = workspace.members.find(
        (m) => m.user.toString() === req.user!.id
      );

      if (!member) {
        throw ApiError.forbidden('You are not a member of this workspace');
      }

      if (!allowedRoles.includes(member.role)) {
        throw ApiError.forbidden(
          `Requires one of the following roles: ${allowedRoles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Checks if the user is a member of the workspace associated with the idea.
 */
export const requireIdeaMembership = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const ideaId = req.params.ideaId || req.body.ideaId;

    if (!ideaId) {
      throw ApiError.badRequest('Idea ID is required');
    }

    const idea = await Idea.findById(ideaId);

    if (!idea) {
      throw ApiError.notFound('Idea not found');
    }

    const session = await Session.findById(idea.session);

    if (!session) {
      throw ApiError.notFound('Session not found');
    }

    const workspace = await Workspace.findById(session.workspace);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    const isMember =
      workspace.owner.toString() === req.user.id ||
      workspace.members.some((m) => m.user.toString() === req.user!.id);

    if (!isMember) {
      throw ApiError.forbidden('You are not a member of this workspace');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Restricts idea updates or deletions to original author or facilitator/admin.
 */
export const requireIdeaOwnerOrFacilitator = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const ideaId = req.params.ideaId || req.body.ideaId;

    if (!ideaId) {
      throw ApiError.badRequest('Idea ID is required');
    }

    const idea = await Idea.findById(ideaId);

    if (!idea) {
      throw ApiError.notFound('Idea not found');
    }

    if (idea.author.toString() === req.user.id) {
      return next();
    }

    const session = await Session.findById(idea.session);

    if (!session) {
      throw ApiError.notFound('Session not found');
    }

    const workspace = await Workspace.findById(session.workspace);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    if (workspace.owner.toString() === req.user.id) {
      return next();
    }

    const member = workspace.members.find(
      (m) => m.user.toString() === req.user!.id
    );

    if (!member) {
      throw ApiError.forbidden('You are not a member of this workspace');
    }

    if ([UserRole.WORKSPACE_ADMIN, UserRole.FACILITATOR].includes(member.role)) {
      return next();
    }

    throw ApiError.forbidden('Only the author or facilitator can modify/delete this idea');
  } catch (error) {
    next(error);
  }
};

/**
 * Checks if the user is a member of the workspace associated with the cluster.
 */
export const requireClusterMembership = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const clusterId = req.params.clusterId || req.body.clusterId;

    if (!clusterId) {
      throw ApiError.badRequest('Cluster ID is required');
    }

    const cluster = await Cluster.findById(clusterId);

    if (!cluster) {
      throw ApiError.notFound('Cluster not found');
    }

    const session = await Session.findById(cluster.session);

    if (!session) {
      throw ApiError.notFound('Session not found');
    }

    const workspace = await Workspace.findById(session.workspace);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    const isMember =
      workspace.owner.toString() === req.user.id ||
      workspace.members.some((m) => m.user.toString() === req.user!.id);

    if (!isMember) {
      throw ApiError.forbidden('You are not a member of this workspace');
    }

    next();
  } catch (error) {
    next(error);
  }
};
