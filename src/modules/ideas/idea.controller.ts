import { Request, Response } from 'express';
import { IdeaService } from './idea.service';
import { ApiResponse } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../types';
import { getPagination } from '../../utils/pagination';

export class IdeaController {
  static create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const idea = await IdeaService.create(req.body, req.user!.id);
    ApiResponse.created(res, idea);
  });

  static update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const idea = await IdeaService.update(req.params.ideaId, req.body, req.user!.id);
    ApiResponse.success(res, idea);
  });

  static delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    await IdeaService.delete(req.params.ideaId, req.user!.id);
    ApiResponse.success(res, null, 'Idea deleted');
  });

  static move = asyncHandler(async (req: AuthRequest, res: Response) => {
    const idea = await IdeaService.move(req.params.ideaId, req.body.newParentId, req.user!.id);
    ApiResponse.success(res, idea, 'Idea moved');
  });

  static getHierarchy = asyncHandler(async (req: Request, res: Response) => {
    const ideas = await IdeaService.getHierarchy(req.params.sessionId);
    ApiResponse.success(res, ideas);
  });

  static getChildren = asyncHandler(async (req: Request, res: Response) => {
    const children = await IdeaService.getChildren(req.params.ideaId);
    ApiResponse.success(res, children);
  });

  static getVersionHistory = asyncHandler(async (req: Request, res: Response) => {
    const versions = await IdeaService.getVersionHistory(req.params.ideaId);
    ApiResponse.success(res, versions);
  });

  static restoreVersion = asyncHandler(async (req: AuthRequest, res: Response) => {
    const versionNumber = parseInt(req.params.version, 10);
    const idea = await IdeaService.restoreVersion(req.params.ideaId, versionNumber, req.user!.id);
    ApiResponse.success(res, idea, 'Version restored');
  });

  static search = asyncHandler(async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const query = (req.query.q as string) || '';
    const result = await IdeaService.search(req.params.sessionId, query, pagination);
    ApiResponse.paginated(res, result.ideas, result.pagination);
  });
}
