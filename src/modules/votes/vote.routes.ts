import { Router } from 'express';
import { VoteController } from './vote.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireSessionMembership, requireIdeaMembership } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { castVoteSchema } from './vote.validators';

const router = Router();
router.use(authenticate);

router.post('/', validate(castVoteSchema), requireSessionMembership, VoteController.cast);
router.delete('/idea/:ideaId', requireIdeaMembership, VoteController.remove);
router.get('/session/:sessionId/analytics', requireSessionMembership, VoteController.getAnalytics);
router.get('/session/:sessionId/my-votes', requireSessionMembership, VoteController.getMyVotes);
router.get('/idea/:ideaId', requireIdeaMembership, VoteController.getVotesForIdea);

export default router;
