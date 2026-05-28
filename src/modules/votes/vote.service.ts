import { Vote } from './vote.model';
import { Idea } from '../ideas/idea.model';
import { ActivityLog } from '../activity/activity.model';
import { ApiError } from '../../utils/apiError';
import { VoteType, ActivityAction } from '../../types';

/**
 * Vote Service — handles casting, removing, and aggregating votes.
 */
export class VoteService {
  /**
   * Cast a vote on an idea.
   * If user already voted, update the vote type/weight.
   */
  static async castVote(
    data: { ideaId: string; sessionId: string; type: VoteType; weight?: number },
    userId: string
  ) {
    const idea = await Idea.findById(data.ideaId);
    if (!idea) throw ApiError.notFound('Idea not found');
    if (idea.isDeleted) throw ApiError.badRequest('Cannot vote on a deleted idea');

    // Upsert the vote (one per user per idea)
    const existingVote = await Vote.findOne({ idea: data.ideaId, user: userId });

    if (existingVote) {
      // Update existing vote
      const oldType = existingVote.type;
      existingVote.type = data.type;
      existingVote.weight = data.weight || 1;
      await existingVote.save();

      // Recalculate idea vote counts
      await this.recalculateVoteCounts(data.ideaId);

      return existingVote;
    }

    // Create new vote
    const vote = await Vote.create({
      idea: data.ideaId,
      user: userId,
      session: data.sessionId,
      type: data.type,
      weight: data.weight || 1,
    });

    // Update idea vote counts
    await this.recalculateVoteCounts(data.ideaId);

    // Log activity
    await ActivityLog.create({
      session: data.sessionId,
      user: userId,
      action: ActivityAction.VOTE_CAST,
      targetType: 'Vote',
      targetId: vote._id,
      metadata: { ideaId: data.ideaId, type: data.type, weight: data.weight || 1 },
    });

    return vote;
  }

  /** Remove a vote from an idea. */
  static async removeVote(ideaId: string, userId: string) {
    const vote = await Vote.findOneAndDelete({ idea: ideaId, user: userId });
    if (!vote) throw ApiError.notFound('Vote not found');

    await this.recalculateVoteCounts(ideaId);

    await ActivityLog.create({
      session: vote.session,
      user: userId,
      action: ActivityAction.VOTE_REMOVED,
      targetType: 'Vote',
      targetId: vote._id,
      metadata: { ideaId },
    });

    return vote;
  }

  /** Get vote analytics for a session — top-voted ideas, vote distribution. */
  static async getAnalytics(sessionId: string) {
    const [totalVotes, votesByType, topIdeas] = await Promise.all([
      Vote.countDocuments({ session: sessionId }),
      Vote.aggregate([
        { $match: { session: sessionId } },
        { $group: { _id: '$type', count: { $sum: 1 }, totalWeight: { $sum: '$weight' } } },
      ]),
      Idea.find({ session: sessionId, isDeleted: false })
        .sort({ upvoteCount: -1 })
        .limit(10)
        .populate('author', 'name email')
        .select('title upvoteCount downvoteCount'),
    ]);

    return { totalVotes, votesByType, topIdeas };
  }

  /** Get votes for a specific idea. */
  static async getVotesForIdea(ideaId: string) {
    return Vote.find({ idea: ideaId }).populate('user', 'name email');
  }

  /** Recalculate and update vote counts on an idea. */
  private static async recalculateVoteCounts(ideaId: string) {
    const [upvotes, downvotes] = await Promise.all([
      Vote.aggregate([
        { $match: { idea: ideaId, type: VoteType.UPVOTE } },
        { $group: { _id: null, total: { $sum: '$weight' } } },
      ]),
      Vote.aggregate([
        { $match: { idea: ideaId, type: VoteType.DOWNVOTE } },
        { $group: { _id: null, total: { $sum: '$weight' } } },
      ]),
    ]);

    await Idea.findByIdAndUpdate(ideaId, {
      upvoteCount: upvotes[0]?.total || 0,
      downvoteCount: downvotes[0]?.total || 0,
    });
  }
}
