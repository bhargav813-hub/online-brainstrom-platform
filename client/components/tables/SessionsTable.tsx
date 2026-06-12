'use client';

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';
import { ArrowRight, LogIn, Zap } from 'lucide-react';
import type { Session } from '@/types/models';

interface SessionsTableProps {
  sessions: Session[];
  getHref: (sessionId: string) => string;
  onJoin?: (sessionId: string) => void;
  isJoining?: boolean;
}

export function SessionsTable({
  sessions,
  getHref,
  onJoin,
  isJoining = false,
}: SessionsTableProps) {
  if (sessions.length === 0) return null;

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-[280px]">Session</TableHead>
            <TableHead>Facilitator</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{session.title}</p>
                    {session.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{session.description}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <UserAvatar name={session.facilitator.name} avatar={session.facilitator.avatar} size="sm" />
                  <span className="text-xs text-muted-foreground">{session.facilitator.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={session.status} />
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(session.createdAt)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {session.status !== 'ended' && onJoin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onJoin(session._id)}
                      disabled={isJoining}
                    >
                      <LogIn className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Link href={getHref(session._id)}>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
