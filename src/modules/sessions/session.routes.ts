import { Router } from 'express';
import { SessionController } from './session.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireMembership, requireBoardMembership, requireSessionMembership, requireSessionRole, requireBoardOwnerOrFacilitator } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createSessionSchema, updateSessionSchema, inviteToSessionSchema } from './session.validators';
import { UserRole } from '../../types';

const router = Router();
router.use(authenticate);

router.post('/', validate(createSessionSchema), requireBoardOwnerOrFacilitator, SessionController.create);
router.get('/board/:boardId', requireBoardMembership, SessionController.getByBoard);
router.get('/:sessionId', requireSessionMembership, SessionController.getById);
router.put('/:sessionId', requireSessionRole(UserRole.WORKSPACE_ADMIN, UserRole.FACILITATOR), validate(updateSessionSchema), SessionController.update);
router.post('/:sessionId/join', requireSessionMembership, SessionController.join);
router.post('/:sessionId/leave', requireSessionMembership, SessionController.leave);
router.post('/:sessionId/invite', requireSessionRole(UserRole.WORKSPACE_ADMIN, UserRole.FACILITATOR), validate(inviteToSessionSchema), SessionController.invite);
router.get('/:sessionId/analytics', requireSessionMembership, SessionController.getAnalytics);

export default router;
