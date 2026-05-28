import { Request, Response } from 'express';
import { BoardService } from './board.service';
import { ApiResponse } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../types';
import { getPagination } from '../../utils/pagination';

export class BoardController {
  static create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const board = await BoardService.create(req.body, req.user!.id);
    ApiResponse.created(res, board);
  });

  static getByWorkspace = asyncHandler(async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const includeArchived = req.query.includeArchived === 'true';
    const result = await BoardService.getByWorkspace(req.params.workspaceId, pagination, includeArchived);
    ApiResponse.paginated(res, result.boards, result.pagination);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const board = await BoardService.getById(req.params.boardId);
    ApiResponse.success(res, board);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const board = await BoardService.update(req.params.boardId, req.body);
    ApiResponse.success(res, board);
  });

  static archive = asyncHandler(async (req: Request, res: Response) => {
    const board = await BoardService.archive(req.params.boardId);
    ApiResponse.success(res, board, 'Board archived');
  });

  static unarchive = asyncHandler(async (req: Request, res: Response) => {
    const board = await BoardService.unarchive(req.params.boardId);
    ApiResponse.success(res, board, 'Board unarchived');
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await BoardService.delete(req.params.boardId);
    ApiResponse.success(res, null, 'Board deleted');
  });
}
