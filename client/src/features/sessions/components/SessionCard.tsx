'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Users, Clock, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/formatters';
import { ROUTES } from '@/constants/routes';
import type { Session } from '@/types/session.types';

interface SessionCardProps {
  session: Session;
  workspaceId: string;
  boardId: string;
  index: number;
}

export function SessionCard({ session, workspaceId, boardId, index }: SessionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={ROUTES.SESSION(workspaceId, boardId, session._id)}>
        <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-muted/50">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg truncate group-hover:text-violet-600 transition-colors">
                {session.title}
              </CardTitle>
              <StatusBadge status={session.status} />
            </div>
            {session.description && (
              <CardDescription className="line-clamp-2">{session.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex items-center gap-4 text-xs text-muted-foreground">
            {session.participants && (
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {session.participants.filter((p) => p.isActive).length} online
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatRelativeTime(session.createdAt)}
            </span>
            <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
