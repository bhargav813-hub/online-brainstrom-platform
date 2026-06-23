'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVoteAnalytics } from '@/features/votes/hooks/useVote';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { BarChart3, TrendingUp, ThumbsUp, ThumbsDown } from 'lucide-react';

interface VoteAnalyticsDashboardProps {
  sessionId: string;
}

export function VoteAnalyticsDashboard({ sessionId }: VoteAnalyticsDashboardProps) {
  const { data: analytics, isLoading } = useVoteAnalytics(sessionId);

  if (isLoading) return <LoadingSpinner />;
  if (!analytics) return null;

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-muted/30">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <BarChart3 className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{analytics.totalVotes}</p>
              <p className="text-xs text-muted-foreground">Total Votes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <ThumbsUp className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{analytics.totalUpvotes}</p>
              <p className="text-xs text-muted-foreground">Upvotes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
              <ThumbsDown className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{analytics.totalDownvotes}</p>
              <p className="text-xs text-muted-foreground">Downvotes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top voted ideas */}
      {analytics.topVotedIdeas?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Top Voted Ideas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.topVotedIdeas.map((item, i) => {
              const maxScore = analytics.topVotedIdeas[0]?.score || 1;
              const barWidth = Math.max((item.score / maxScore) * 100, 5);
              return (
                <div key={item.idea._id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-600">
                        {i + 1}
                      </span>
                      <span className="font-medium truncate max-w-[200px]">{item.idea.title}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-600">↑{item.upvotes}</span>
                      <span className="text-rose-500">↓{item.downvotes}</span>
                      <span className="font-bold text-violet-600">Score: {item.score}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
