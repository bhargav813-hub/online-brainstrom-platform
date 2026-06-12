'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { ROUTES } from '@/constants/routes';
import { formatRelativeTime } from '@/lib/utils';
import { Users, ArrowRight } from 'lucide-react';
import type { Workspace } from '@/types/models';
import { motion } from 'framer-motion';

interface WorkspaceCardProps {
  workspace: Workspace;
  onMouseEnter?: () => void;
}

export function WorkspaceCard({ workspace, onMouseEnter }: WorkspaceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      onMouseEnter={onMouseEnter}
    >
      <Link href={ROUTES.WORKSPACE_DETAIL(workspace._id)}>
        <Card className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:glow-sm cursor-pointer h-full">
          {/* Gradient accent */}
          <div className="absolute inset-x-0 top-0 h-1 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                {workspace.name}
              </CardTitle>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </div>
            {workspace.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {workspace.description}
              </p>
            )}
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {workspace.members.slice(0, 3).map((member) => (
                    <UserAvatar
                      key={member.user._id}
                      name={member.user.name}
                      avatar={member.user.avatar}
                      size="sm"
                      className="border-2 border-background"
                    />
                  ))}
                </div>
                <Badge variant="secondary" className="text-xs gap-1">
                  <Users className="h-3 w-3" />
                  {workspace.members.length}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(workspace.createdAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
