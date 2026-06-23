export type VoteType = 'upvote' | 'downvote';

export interface Vote {
  _id: string;
  user: string;
  idea: string;
  session: string;
  type: VoteType;
  weight: number;
  createdAt: string;
}

export interface CastVotePayload {
  ideaId: string;
  sessionId: string;
  type: VoteType;
  weight?: number;
}

export interface VoteAnalytics {
  totalVotes: number;
  totalUpvotes: number;
  totalDownvotes: number;
  topVotedIdeas: Array<{
    idea: {
      _id: string;
      title: string;
    };
    upvotes: number;
    downvotes: number;
    score: number;
  }>;
}
