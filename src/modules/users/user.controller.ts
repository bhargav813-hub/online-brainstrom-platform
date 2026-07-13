import { Request, Response } from 'express';
import { UserService } from './user.service';
import { ApiResponse } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../types';
import { ApiError } from '../../utils/apiError';

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

  static changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    await UserService.changePassword(req.user!.id, req.body);
    ApiResponse.success(res, null, 'Password changed successfully');
  });

  static uploadAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }
    const user = await UserService.uploadAvatar(req.user!.id, req.file.buffer);
    ApiResponse.success(res, user, 'Avatar uploaded successfully');
  });

  static deleteAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await UserService.deleteAvatar(req.user!.id);
    ApiResponse.success(res, user, 'Avatar deleted successfully');
  });
}
