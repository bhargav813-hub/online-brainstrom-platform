import { Request, Response } from 'express';
import { WorkspaceService } from './workspace.service';
import { ApiResponse } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../types';

export class WorkspaceController {
  /** POST /api/workspaces */
  static create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const workspace = await WorkspaceService.create(req.body, req.user!.id);
    ApiResponse.created(res, workspace);
  });

  /** GET /api/workspaces */
  static getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const workspaces = await WorkspaceService.getUserWorkspaces(req.user!.id);
    ApiResponse.success(res, workspaces);
  });

  /** GET /api/workspaces/:workspaceId */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await WorkspaceService.getById(req.params.workspaceId);
    ApiResponse.success(res, workspace);
  });

  /** PUT /api/workspaces/:workspaceId */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await WorkspaceService.update(req.params.workspaceId, req.body);
    ApiResponse.success(res, workspace);
  });

  /** POST /api/workspaces/:workspaceId/invite */
  static invite = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await WorkspaceService.inviteUser(
      req.params.workspaceId,
      req.body.email,
      req.body.role
    );
    ApiResponse.success(res, workspace, 'User invited successfully');
  });

  /** PUT /api/workspaces/:workspaceId/assign-role */
  static assignRole = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await WorkspaceService.assignRole(
      req.params.workspaceId,
      req.body.userId,
      req.body.role
    );
    ApiResponse.success(res, workspace, 'Role assigned successfully');
  });

  /** DELETE /api/workspaces/:workspaceId/members/:userId */
  static removeMember = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await WorkspaceService.removeMember(
      req.params.workspaceId,
      req.params.userId
    );
    ApiResponse.success(res, workspace, 'Member removed');
  });

  /** DELETE /api/workspaces/:workspaceId */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    await WorkspaceService.delete(req.params.workspaceId);
    ApiResponse.success(res, null, 'Workspace deleted');
  });
}
