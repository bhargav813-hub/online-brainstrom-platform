import { Request, Response } from 'express';
import { UserService } from './user.service';
import { ApiResponse } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../types';

export class UserController {
  static getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await UserService.getProfile(req.user!.id);
    ApiResponse.success(res, user);
  });

  static updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await UserService.updateProfile(req.user!.id, req.body);
    ApiResponse.success(res, user);
  });

  static search = asyncHandler(async (req: Request, res: Response) => {
    const query = (req.query.q as string) || '';
    const users = await UserService.search(query);
    ApiResponse.success(res, users);
  });
}
