'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';
import { Layers, Trash2, Pencil } from 'lucide-react';
import type { Cluster } from '@/types/models';
import { motion } from 'framer-motion';

interface ClusterCardProps {
  cluster: Cluster;
  onEdit?: () => void;
  onDelete?: () => void;
  canManage?: boolean;
}

export function ClusterCard({ cluster, onEdit, onDelete, canManage }: ClusterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
        <div
          className="h-1.5"
          style={{ backgroundColor: cluster.color || 'hsl(var(--primary))' }}
        />
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Layers className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <CardTitle className="text-sm font-semibold line-clamp-1">
                {cluster.name}
              </CardTitle>
            </div>
            {canManage && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={onDelete}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {cluster.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{cluster.description}</p>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-[10px]">
              {cluster.ideas.length} idea{cluster.ideas.length !== 1 ? 's' : ''}
            </Badge>
            <span>{formatRelativeTime(cluster.createdAt)}</span>
          </div>

          {cluster.tags && cluster.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {cluster.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Idea previews */}
          {cluster.ideas.length > 0 && (
            <div className="pt-1 space-y-1">
              {cluster.ideas.slice(0, 3).map((idea) => (
                <div key={idea._id} className="text-xs text-muted-foreground truncate pl-2 border-l-2 border-border/50">
                  {idea.title}
                </div>
              ))}
              {cluster.ideas.length > 3 && (
                <p className="text-[10px] text-muted-foreground pl-2">
                  +{cluster.ideas.length - 3} more
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
