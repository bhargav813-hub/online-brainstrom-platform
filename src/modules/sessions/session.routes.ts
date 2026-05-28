import { Router } from 'express';
import { SessionController } from './session.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createSessionSchema, updateSessionSchema } from './session.validators';

const router = Router();
router.use(authenticate);

router.post('/', validate(createSessionSchema), SessionController.create);
router.get('/board/:boardId', SessionController.getByBoard);
router.get('/:sessionId', SessionController.getById);
router.put('/:sessionId', validate(updateSessionSchema), SessionController.update);
router.post('/:sessionId/join', SessionController.join);
router.post('/:sessionId/leave', SessionController.leave);
router.get('/:sessionId/analytics', SessionController.getAnalytics);

export default router;
