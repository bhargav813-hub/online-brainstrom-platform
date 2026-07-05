import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { changePasswordSchema } from './user.validators';
import { uploadAvatar } from '../../middleware/upload.middleware';

const router = Router();
router.use(authenticate);

router.get('/me', UserController.getProfile);
router.put('/me', UserController.updateProfile);
router.put('/change-password', validate(changePasswordSchema), UserController.changePassword);
router.get('/search', UserController.search);
router.post('/avatar', uploadAvatar.single('avatar'), UserController.uploadAvatar);
router.put('/avatar', uploadAvatar.single('avatar'), UserController.uploadAvatar);
router.delete('/avatar', UserController.deleteAvatar);

export default router;
