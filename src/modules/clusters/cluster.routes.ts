import { Router } from 'express';
import { ClusterController } from './cluster.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createClusterSchema, updateClusterSchema, assignIdeasSchema } from './cluster.validators';

const router = Router();
router.use(authenticate);

router.post('/', validate(createClusterSchema), ClusterController.create);
router.get('/session/:sessionId', ClusterController.getBySession);
router.put('/:clusterId', validate(updateClusterSchema), ClusterController.update);
router.post('/:clusterId/ideas', validate(assignIdeasSchema), ClusterController.assignIdeas);
router.delete('/:clusterId/ideas', ClusterController.removeIdeas);
router.delete('/:clusterId', ClusterController.delete);

export default router;
