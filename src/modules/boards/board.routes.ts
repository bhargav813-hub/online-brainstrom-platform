import { Router } from 'express';
import { BoardController } from './board.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createBoardSchema, updateBoardSchema } from './board.validators';

const router = Router();
router.use(authenticate);

router.post('/', validate(createBoardSchema), BoardController.create);
router.get('/workspace/:workspaceId', BoardController.getByWorkspace);
router.get('/:boardId', BoardController.getById);
router.put('/:boardId', validate(updateBoardSchema), BoardController.update);
router.patch('/:boardId/archive', BoardController.archive);
router.patch('/:boardId/unarchive', BoardController.unarchive);
router.delete('/:boardId', BoardController.delete);

export default router;
