import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types';
import { ApiError } from '../utils/apiError';
import { Workspace } from '../modules/workspaces/workspace.model';

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
