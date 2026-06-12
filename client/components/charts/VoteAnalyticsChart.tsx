'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import type { VoteAnalytics } from '@/types/models';
import { motion } from 'framer-motion';

interface VoteAnalyticsChartProps {
  analytics: VoteAnalytics;
}

export function VoteAnalyticsChart({ analytics }: VoteAnalyticsChartProps) {
  const { totalVotes, votesByType } = analytics;
  const upPct = totalVotes > 0 ? (votesByType.upvotes / totalVotes) * 100 : 0;
  const downPct = totalVotes > 0 ? (votesByType.downvotes / totalVotes) * 100 : 0;

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-4 w-4 text-primary" />
          Vote Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalVotes === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No votes cast yet</p>
        ) : (
          <div className="space-y-6">
            {/* Visual bar chart */}
            <div className="flex h-32 items-end gap-6 justify-center">
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="text-sm font-bold text-emerald-500">{votesByType.upvotes}</span>
                <motion.div
                  className="w-16 rounded-t-lg bg-gradient-to-t from-emerald-500/80 to-emerald-400"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(upPct, 5)}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ minHeight: '8px', maxHeight: '96px' }}
                />
                <span className="text-xs text-muted-foreground">Upvotes</span>
              </motion.div>
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="text-sm font-bold text-red-400">{votesByType.downvotes}</span>
                <motion.div
                  className="w-16 rounded-t-lg bg-gradient-to-t from-red-500/80 to-red-400"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(downPct, 5)}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ minHeight: '8px', maxHeight: '96px' }}
                />
                <span className="text-xs text-muted-foreground">Downvotes</span>
              </motion.div>
            </div>

            {/* Progress bars */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Upvotes</span>
                  <span className="font-medium text-emerald-500">{upPct.toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-accent overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${upPct}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Downvotes</span>
                  <span className="font-medium text-red-400">{downPct.toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-accent overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-red-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${downPct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="text-center pt-2 border-t border-border/50">
              <span className="text-2xl font-bold">{totalVotes}</span>
              <p className="text-xs text-muted-foreground">Total Votes</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
