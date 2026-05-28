import { Router } from 'express';
import { WorkspaceController } from './workspace.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createWorkspaceSchema, inviteUserSchema, assignRoleSchema } from './workspace.validators';
import { UserRole } from '../../types';

const router = Router();

// All workspace routes require authentication
router.use(authenticate);

router.post('/', validate(createWorkspaceSchema), WorkspaceController.create);
router.get('/', WorkspaceController.getAll);
router.get('/:workspaceId', WorkspaceController.getById);
router.put('/:workspaceId', requireRole(UserRole.WORKSPACE_ADMIN), WorkspaceController.update);
router.delete('/:workspaceId', requireRole(UserRole.WORKSPACE_ADMIN), WorkspaceController.delete);

// Member management
router.post(
  '/:workspaceId/invite',
  requireRole(UserRole.WORKSPACE_ADMIN, UserRole.FACILITATOR),
  validate(inviteUserSchema),
  WorkspaceController.invite
);
router.put(
  '/:workspaceId/assign-role',
  requireRole(UserRole.WORKSPACE_ADMIN),
  validate(assignRoleSchema),
  WorkspaceController.assignRole
);
router.delete(
  '/:workspaceId/members/:userId',
  requireRole(UserRole.WORKSPACE_ADMIN),
  WorkspaceController.removeMember
);

export default router;
