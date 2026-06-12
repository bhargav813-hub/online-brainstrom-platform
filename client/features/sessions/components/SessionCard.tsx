'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';
import { Users, ArrowRight, LogIn } from 'lucide-react';
import type { Session } from '@/types/models';
import { motion } from 'framer-motion';

interface SessionCardProps {
  session: Session;
  href: string;
  onJoin?: () => void;
  isJoining?: boolean;
}

export function SessionCard({ session, href, onJoin, isJoining }: SessionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full">
        {session.status === 'active' && (
          <div className="absolute top-3 right-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start gap-2">
            <CardTitle className="text-base font-semibold line-clamp-1 flex-1">
              {session.title}
            </CardTitle>
            <StatusBadge status={session.status} />
          </div>
          {session.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{session.description}</p>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {session.maxParticipants ? `Max ${session.maxParticipants}` : 'Unlimited'}
              </span>
              <span>{formatRelativeTime(session.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              {session.status === 'active' && onJoin && (
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={(e) => { e.preventDefault(); onJoin(); }} disabled={isJoining}>
                  <LogIn className="mr-1 h-3 w-3" />
                  Join
                </Button>
              )}
              <Link href={href}>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
