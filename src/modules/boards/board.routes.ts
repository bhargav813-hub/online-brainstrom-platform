import { Router } from 'express';
import { BoardController } from './board.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireMembership, requireBoardMembership, requireBoardRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createBoardSchema, updateBoardSchema } from './board.validators';
import { UserRole } from '../../types';

const router = Router();

// Public guest access route
router.get('/shared/:shareToken', BoardController.getShared);

// Authenticated routes
router.use(authenticate);

router.post('/', validate(createBoardSchema), requireMembership, BoardController.create);
router.get('/workspace/:workspaceId', requireMembership, BoardController.getByWorkspace);
router.get('/:boardId', requireBoardMembership, BoardController.getById);
router.put('/:boardId', requireBoardRole(UserRole.WORKSPACE_ADMIN, UserRole.FACILITATOR), validate(updateBoardSchema), BoardController.update);
router.patch('/:boardId/archive', requireBoardRole(UserRole.WORKSPACE_ADMIN, UserRole.FACILITATOR), BoardController.archive);
router.patch('/:boardId/unarchive', requireBoardRole(UserRole.WORKSPACE_ADMIN, UserRole.FACILITATOR), BoardController.unarchive);
router.delete('/:boardId', requireBoardRole(UserRole.WORKSPACE_ADMIN), BoardController.delete);

// Board sharing & export
router.post('/:boardId/share', requireBoardRole(UserRole.WORKSPACE_ADMIN, UserRole.FACILITATOR), BoardController.share);
router.post('/:boardId/unshare', requireBoardRole(UserRole.WORKSPACE_ADMIN, UserRole.FACILITATOR), BoardController.unshare);
router.get('/:boardId/export', requireBoardMembership, BoardController.exportBoard);

export default router;
