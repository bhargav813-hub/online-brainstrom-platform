import { Request, Response } from 'express';
import { ClusterService } from './cluster.service';
import { ApiResponse } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../types';

export class ClusterController {
  static create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const cluster = await ClusterService.create(req.body, req.user!.id);
    ApiResponse.created(res, cluster);
  });

  static getBySession = asyncHandler(async (req: Request, res: Response) => {
    const clusters = await ClusterService.getBySession(req.params.sessionId);
    ApiResponse.success(res, clusters);
  });

  static update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const cluster = await ClusterService.update(req.params.clusterId, req.body, req.user!.id);
    ApiResponse.success(res, cluster);
  });

  static assignIdeas = asyncHandler(async (req: AuthRequest, res: Response) => {
    const cluster = await ClusterService.assignIdeas(req.params.clusterId, req.body.ideaIds, req.user!.id);
    ApiResponse.success(res, cluster, 'Ideas assigned');
  });

  static removeIdeas = asyncHandler(async (req: Request, res: Response) => {
    const cluster = await ClusterService.removeIdeas(req.params.clusterId, req.body.ideaIds);
    ApiResponse.success(res, cluster, 'Ideas removed from cluster');
  });

  static delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    await ClusterService.delete(req.params.clusterId, req.user!.id);
    ApiResponse.success(res, null, 'Cluster deleted');
  });
}
