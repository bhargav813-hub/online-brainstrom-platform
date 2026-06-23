'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSessionAnalytics } from '@/features/sessions/hooks/useSession';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { Lightbulb, ThumbsUp, Users, TrendingUp } from 'lucide-react';

interface SessionAnalyticsProps {
  sessionId: string;
}

export function SessionAnalytics({ sessionId }: SessionAnalyticsProps) {
  const { data: analytics, isLoading } = useSessionAnalytics(sessionId);

  if (isLoading) return <LoadingSpinner size="sm" />;
  if (!analytics) return null;

  const stats = [
    { label: 'Total Ideas', value: analytics.totalIdeas, icon: Lightbulb, color: 'text-amber-500' },
    { label: 'Total Votes', value: analytics.totalVotes, icon: ThumbsUp, color: 'text-violet-500' },
    { label: 'Participants', value: analytics.totalParticipants, icon: Users, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-muted/30">
            <CardContent className="p-3 text-center">
              <stat.icon className={`mx-auto h-5 w-5 ${stat.color} mb-1`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {analytics.topIdeas?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Top Ideas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analytics.topIdeas.slice(0, 5).map((idea, i) => (
              <div key={idea._id} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-600">
                  {i + 1}
                </span>
                <span className="flex-1 truncate font-medium">{idea.title}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-emerald-600">↑{idea.upvoteCount}</span>
                  <span className="text-rose-500">↓{idea.downvoteCount}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
