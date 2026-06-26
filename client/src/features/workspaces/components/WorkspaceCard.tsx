'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, Calendar, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/formatters';
import { ROUTES } from '@/constants/routes';
import type { Workspace } from '@/types/workspace.types';

interface WorkspaceCardProps {
  workspace: Workspace;
  index: number;
}

const gradients = [
  'from-violet-500/10 to-indigo-500/10',
  'from-rose-500/10 to-pink-500/10',
  'from-emerald-500/10 to-teal-500/10',
  'from-amber-500/10 to-orange-500/10',
  'from-cyan-500/10 to-blue-500/10',
];

export function WorkspaceCard({ workspace, index }: WorkspaceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={ROUTES.WORKSPACE(workspace._id)}>
        <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 border-muted/50">
          <div className={`h-1.5 bg-gradient-to-r ${gradients[index % gradients.length]}`} />
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="truncate">{workspace.name}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
            </CardTitle>
            {workspace.description && (
              <CardDescription className="line-clamp-2">{workspace.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {workspace.members?.length || 0} members
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatRelativeTime(workspace.createdAt)}
            </span>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
