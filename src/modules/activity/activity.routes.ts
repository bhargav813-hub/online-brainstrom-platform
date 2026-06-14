import { Router } from 'express';
import { ActivityController } from './activity.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireSessionMembership } from '../../middleware/rbac.middleware';

const router = Router();
router.use(authenticate);

router.get('/session/:sessionId', requireSessionMembership, ActivityController.getTimeline);
router.get('/session/:sessionId/filter', requireSessionMembership, ActivityController.getByAction);
router.get('/session/:sessionId/user/:userId', requireSessionMembership, ActivityController.getUserActivity);

export default router;
