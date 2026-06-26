'use client';

import { useClusters, useDeleteCluster } from '@/features/clusters/hooks/useCluster';
import { ClusterCard } from './ClusterCard';
import { CreateClusterModal } from './CreateClusterModal';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { Layers } from 'lucide-react';

interface ClusterListProps {
  sessionId: string;
  canManage?: boolean;
}

export function ClusterList({ sessionId, canManage }: ClusterListProps) {
  const { data: clusters, isLoading } = useClusters(sessionId);
  const deleteCluster = useDeleteCluster(sessionId);

  if (isLoading) return <LoadingSpinner size="sm" />;

  return (
    <div className="space-y-3">
      {canManage && (
        <div className="flex justify-end">
          <CreateClusterModal sessionId={sessionId} />
        </div>
      )}
      {!clusters?.length ? (
        <EmptyState
          icon={Layers}
          title="No clusters yet"
          description={canManage ? 'Create a cluster to group related ideas' : 'No clusters have been created'}
        />
      ) : (
        <div className="space-y-2">
          {clusters.map((cluster) => (
            <ClusterCard
              key={cluster._id}
              cluster={cluster}
              sessionId={sessionId}
              canManage={canManage}
              onDelete={(id) => deleteCluster.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
