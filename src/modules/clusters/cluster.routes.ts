import { Router } from 'express';
import { ClusterController } from './cluster.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireSessionMembership, requireSessionFacilitatorOrAdmin, requireClusterFacilitatorOrAdmin } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createClusterSchema, updateClusterSchema, assignIdeasSchema } from './cluster.validators';

const router = Router();
router.use(authenticate);

router.post('/', validate(createClusterSchema), requireSessionFacilitatorOrAdmin, ClusterController.create);
router.get('/session/:sessionId', requireSessionMembership, ClusterController.getBySession);
router.put('/:clusterId', requireClusterFacilitatorOrAdmin, validate(updateClusterSchema), ClusterController.update);
router.post('/:clusterId/ideas', requireClusterFacilitatorOrAdmin, validate(assignIdeasSchema), ClusterController.assignIdeas);
router.delete('/:clusterId/ideas', requireClusterFacilitatorOrAdmin, ClusterController.removeIdeas);
router.delete('/:clusterId', requireClusterFacilitatorOrAdmin, ClusterController.delete);

export default router;
