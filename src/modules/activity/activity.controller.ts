import { Request, Response } from 'express';
import { ActivityService } from './activity.service';
import { ApiResponse } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { getPagination } from '../../utils/pagination';

export class ActivityController {
  static getTimeline = asyncHandler(async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const result = await ActivityService.getSessionTimeline(req.params.sessionId, pagination);
    ApiResponse.paginated(res, result.activities, result.pagination);
  });

  static getByAction = asyncHandler(async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const result = await ActivityService.getByAction(
      req.params.sessionId,
      req.query.action as string,
      pagination
    );
    ApiResponse.paginated(res, result.activities, result.pagination);
  });

  static getUserActivity = asyncHandler(async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const result = await ActivityService.getUserActivity(
      req.params.sessionId,
      req.params.userId,
      pagination
    );
    ApiResponse.paginated(res, result.activities, result.pagination);
  });
}
