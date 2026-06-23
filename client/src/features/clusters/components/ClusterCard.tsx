'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ClusterIdeaAssigner } from './ClusterIdeaAssigner';
import type { Cluster } from '@/types/cluster.types';

interface ClusterCardProps {
  cluster: Cluster;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  canManage?: boolean;
  sessionId: string;
}

export function ClusterCard({ cluster, onDelete, onClick, canManage, sessionId }: ClusterCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          {cluster.color && (
            <div
              className="h-4 w-4 rounded-full ring-1 ring-border shrink-0"
              style={{ backgroundColor: cluster.color }}
            />
          )}
          <span className="text-sm font-semibold flex-1 truncate">{cluster.name}</span>
          <Badge variant="secondary" className="text-xs shrink-0">
            {cluster.ideas?.length || 0} ideas
          </Badge>
          {canManage && (
            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <ClusterIdeaAssigner
                clusterId={cluster._id}
                sessionId={sessionId}
                existingIdeaIds={cluster.ideas || []}
              />
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(cluster._id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
        {cluster.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{cluster.description}</p>
        )}
        {cluster.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {cluster.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
