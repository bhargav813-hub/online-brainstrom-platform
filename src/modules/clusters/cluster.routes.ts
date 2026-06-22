import { Router } from 'express';
import { ClusterController } from './cluster.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireSessionMembership, requireClusterMembership } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createClusterSchema, updateClusterSchema, assignIdeasSchema } from './cluster.validators';

const router = Router();
router.use(authenticate);

router.post('/', validate(createClusterSchema), requireSessionMembership, ClusterController.create);
router.get('/session/:sessionId', requireSessionMembership, ClusterController.getBySession);
router.put('/:clusterId', requireClusterMembership, validate(updateClusterSchema), ClusterController.update);
router.post('/:clusterId/ideas', requireClusterMembership, validate(assignIdeasSchema), ClusterController.assignIdeas);
router.delete('/:clusterId/ideas', requireClusterMembership, ClusterController.removeIdeas);
router.delete('/:clusterId', requireClusterMembership, ClusterController.delete);

export default router;
