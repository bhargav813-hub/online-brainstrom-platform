import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/me', UserController.getProfile);
router.put('/me', UserController.updateProfile);
router.get('/search', UserController.search);

export default router;
