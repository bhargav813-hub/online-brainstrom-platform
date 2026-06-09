import { Request, Response } from 'express';
import { SessionService } from './session.service';
import { ApiResponse } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../types';
import { getPagination } from '../../utils/pagination';

export class SessionController {
  static create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const session = await SessionService.create(req.body, req.user!.id);
    ApiResponse.created(res, session);
  });

  static getByBoard = asyncHandler(async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const result = await SessionService.getByBoard(
      req.params.boardId,
      pagination,
      req.query.status as string
    );
    ApiResponse.paginated(res, result.sessions, result.pagination);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const result = await SessionService.getById(req.params.sessionId);
    ApiResponse.success(res, result);
  });

  static update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const session = await SessionService.update(req.params.sessionId, req.body, req.user!.id);
    ApiResponse.success(res, session);
  });

  static join = asyncHandler(async (req: AuthRequest, res: Response) => {
    const participant = await SessionService.join(req.params.sessionId, req.user!.id);
    ApiResponse.success(res, participant, 'Joined session');
  });

  static leave = asyncHandler(async (req: AuthRequest, res: Response) => {
    await SessionService.leave(req.params.sessionId, req.user!.id);
    ApiResponse.success(res, null, 'Left session');
  });

  static invite = asyncHandler(async (req: AuthRequest, res: Response) => {
    const participant = await SessionService.invite(
      req.params.sessionId,
      req.body.email,
      req.user!.id
    );
    ApiResponse.success(res, participant, 'User added to session');
  });

  static getAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const analytics = await SessionService.getAnalytics(req.params.sessionId);
    ApiResponse.success(res, analytics);
  });
}
