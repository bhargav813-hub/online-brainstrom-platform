import { Router } from 'express';
import { IdeaController } from './idea.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createIdeaSchema, updateIdeaSchema, moveIdeaSchema } from './idea.validators';

const router = Router();
router.use(authenticate);

// CRUD
router.post('/', validate(createIdeaSchema), IdeaController.create);
router.put('/:ideaId', validate(updateIdeaSchema), IdeaController.update);
router.delete('/:ideaId', IdeaController.delete);

// Tree operations
router.patch('/:ideaId/move', validate(moveIdeaSchema), IdeaController.move);
router.get('/session/:sessionId/hierarchy', IdeaController.getHierarchy);
router.get('/:ideaId/children', IdeaController.getChildren);
router.get('/session/:sessionId/search', IdeaController.search);

// Version history
router.get('/:ideaId/versions', IdeaController.getVersionHistory);
router.post('/:ideaId/restore/:version', IdeaController.restoreVersion);

export default router;
