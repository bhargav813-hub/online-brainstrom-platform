import { Router } from 'express';
import { ActivityController } from './activity.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/session/:sessionId', ActivityController.getTimeline);
router.get('/session/:sessionId/filter', ActivityController.getByAction);
router.get('/session/:sessionId/user/:userId', ActivityController.getUserActivity);

export default router;
