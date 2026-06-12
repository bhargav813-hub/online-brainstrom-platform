'use client';

import { use } from 'react';
import { useSessionAnalytics } from '@/features/sessions/hooks/useSessions';
import { useVoteAnalytics } from '@/features/votes/hooks/useVote';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IdeaCard } from '@/features/ideas/components/IdeaCard';
import {
  Users, Lightbulb, ThumbsUp, Activity,
  TrendingUp, BarChart3,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SessionAnalyticsPage({
  params,
}: {
  params: Promise<{ workspaceId: string; boardId: string; sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const { data: sessionAnalytics, isPending: saLoading } = useSessionAnalytics(sessionId);
  const { data: voteAnalytics, isPending: vaLoading } = useVoteAnalytics(sessionId);

  if (saLoading || vaLoading) return <LoadingSkeleton variant="page" />;

  const stats = [
    { label: 'Active Participants', value: sessionAnalytics?.activeParticipants ?? 0, icon: Users, color: 'text-emerald-500' },
    { label: 'Total Ideas', value: sessionAnalytics?.ideas ?? 0, icon: Lightbulb, color: 'text-amber-500' },
    { label: 'Total Votes', value: sessionAnalytics?.votes ?? 0, icon: ThumbsUp, color: 'text-blue-500' },
    { label: 'Activities', value: sessionAnalytics?.activities ?? 0, icon: Activity, color: 'text-violet-500' },
  ];

  return (
    <PageContainer title="Session Analytics" description="Performance metrics and insights">
      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-accent ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Vote breakdown */}
      {voteAnalytics && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4 text-primary" />
                Vote Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Upvotes</span>
                  <span className="text-sm font-medium text-emerald-500">{voteAnalytics.votesByType.upvotes}</span>
                </div>
                <div className="h-2 rounded-full bg-accent overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${voteAnalytics.totalVotes > 0 ? (voteAnalytics.votesByType.upvotes / voteAnalytics.totalVotes) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Downvotes</span>
                  <span className="text-sm font-medium text-red-400">{voteAnalytics.votesByType.downvotes}</span>
                </div>
                <div className="h-2 rounded-full bg-accent overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-400 transition-all duration-500"
                    style={{
                      width: `${voteAnalytics.totalVotes > 0 ? (voteAnalytics.votesByType.downvotes / voteAnalytics.totalVotes) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" />
                Top Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {voteAnalytics.topIdeas.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No votes yet</p>
              ) : (
                <div className="space-y-2">
                  {voteAnalytics.topIdeas.slice(0, 5).map((item, i) => (
                    <div key={item.idea._id} className="flex items-center gap-3 py-1.5">
                      <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.idea.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.upvotes} up · {item.downvotes} down · {item.totalVotes} total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
