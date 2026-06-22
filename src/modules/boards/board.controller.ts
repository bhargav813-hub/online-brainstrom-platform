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

  static share = asyncHandler(async (req: Request, res: Response) => {
    const board = await BoardService.share(req.params.boardId);
    ApiResponse.success(res, { shareToken: board.shareToken, isPublic: board.isPublic }, 'Board shared successfully');
  });

  static unshare = asyncHandler(async (req: Request, res: Response) => {
    const board = await BoardService.unshare(req.params.boardId);
    ApiResponse.success(res, { isPublic: board.isPublic }, 'Board unshared successfully');
  });

  static getShared = asyncHandler(async (req: Request, res: Response) => {
    const data = await BoardService.getShared(req.params.shareToken);
    ApiResponse.success(res, data);
  });

  static exportBoard = asyncHandler(async (req: Request, res: Response) => {
    const format = (req.query.format as string) === 'json' ? 'json' : 'pdf';
    
    if (format === 'json') {
      const data = await BoardService.exportBoard(req.params.boardId, 'json');
      return ApiResponse.success(res, data);
    }

    const doc = await BoardService.exportBoard(req.params.boardId, 'pdf') as any;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="board-export-${req.params.boardId}.pdf"`
    );
    doc.pipe(res);
  });
}
