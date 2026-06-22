import { Router } from 'express';
import { IdeaController } from './idea.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireSessionMembership, requireIdeaMembership, requireIdeaOwnerOrFacilitator } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createIdeaSchema, updateIdeaSchema, moveIdeaSchema } from './idea.validators';

const router = Router();
router.use(authenticate);

// CRUD
router.post('/', validate(createIdeaSchema), requireSessionMembership, IdeaController.create);
router.put('/:ideaId', requireIdeaOwnerOrFacilitator, validate(updateIdeaSchema), IdeaController.update);
router.delete('/:ideaId', requireIdeaOwnerOrFacilitator, IdeaController.delete);

// Tree operations
router.patch('/:ideaId/move', requireIdeaOwnerOrFacilitator, validate(moveIdeaSchema), IdeaController.move);
router.get('/session/:sessionId/hierarchy', requireSessionMembership, IdeaController.getHierarchy);
router.get('/:ideaId/children', requireIdeaMembership, IdeaController.getChildren);
router.get('/session/:sessionId/search', requireSessionMembership, IdeaController.search);

// Version history
router.get('/:ideaId/versions', requireIdeaMembership, IdeaController.getVersionHistory);
router.post('/:ideaId/restore/:version', requireIdeaOwnerOrFacilitator, IdeaController.restoreVersion);

export default router;
