import { Router } from 'express';
import { VoteController } from './vote.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { castVoteSchema } from './vote.validators';

const router = Router();
router.use(authenticate);

router.post('/', validate(castVoteSchema), VoteController.cast);
router.delete('/idea/:ideaId', VoteController.remove);
router.get('/session/:sessionId/analytics', VoteController.getAnalytics);
router.get('/session/:sessionId/my-votes', VoteController.getMyVotes);
router.get('/idea/:ideaId', VoteController.getVotesForIdea);

export default router;
