import { Request, Response } from 'express';
import { VoteService } from './vote.service';
import { ApiResponse } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../types';

export class VoteController {
  static cast = asyncHandler(async (req: AuthRequest, res: Response) => {
    const vote = await VoteService.castVote(req.body, req.user!.id);
    ApiResponse.success(res, vote, 'Vote cast');
  });

  static remove = asyncHandler(async (req: AuthRequest, res: Response) => {
    await VoteService.removeVote(req.params.ideaId, req.user!.id);
    ApiResponse.success(res, null, 'Vote removed');
  });

  static getAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const analytics = await VoteService.getAnalytics(req.params.sessionId);
    ApiResponse.success(res, analytics);
  });

  static getVotesForIdea = asyncHandler(async (req: Request, res: Response) => {
    const votes = await VoteService.getVotesForIdea(req.params.ideaId);
    ApiResponse.success(res, votes);
  });

  static getMyVotes = asyncHandler(async (req: AuthRequest, res: Response) => {
    const votes = await VoteService.getUserVotesInSession(req.params.sessionId, req.user!.id);
    ApiResponse.success(res, votes);
  });
}
