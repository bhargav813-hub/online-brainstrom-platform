'use client';

import { useState } from 'react';
import { ClusterCard } from './ClusterCard';
import { useClusters, useDeleteCluster } from '@/features/clusters/hooks/useClusters';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClusterForm } from '@/components/forms/ClusterForm';
import { useCreateCluster, useUpdateCluster } from '@/features/clusters/hooks/useClusters';
import { Layers, Plus } from 'lucide-react';
import type { Cluster } from '@/types/models';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ClusterManagerProps {
  sessionId: string;
  canManage: boolean;
  shareToken?: string;
}

export function ClusterManager({ sessionId, canManage, shareToken }: ClusterManagerProps) {
  const { data: clusters, isPending } = useClusters(sessionId, shareToken);
  const createCluster = useCreateCluster(sessionId);
  const updateCluster = useUpdateCluster(sessionId);
  const deleteCluster = useDeleteCluster(sessionId);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCluster, setEditingCluster] = useState<Cluster | null>(null);
  const [deletingClusterId, setDeletingClusterId] = useState<string | null>(null);

  if (isPending) {
    return <LoadingSkeleton variant="card" count={3} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Clusters</h3>
        </div>
        {canManage && (
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-3 w-3" /> New Cluster
          </Button>
        )}
      </div>

      <ScrollArea className="max-h-[500px]">
        {!clusters || clusters.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No clusters yet"
            description={canManage ? 'Create clusters to group related ideas together.' : 'Clusters will appear here once created.'}
          />
        ) : (
          <div className="grid gap-3">
            {clusters.map((cluster) => (
              <ClusterCard
                key={cluster._id}
                cluster={cluster}
                canManage={canManage}
                onEdit={() => setEditingCluster(cluster)}
                onDelete={() => setDeletingClusterId(cluster._id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Create dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <DialogTitle>Create Cluster</DialogTitle>
          </DialogHeader>
          <ClusterForm
            sessionId={sessionId}
            onSubmit={(data) => {
              createCluster.mutate(data as Parameters<typeof createCluster.mutate>[0]);
              setShowCreateDialog(false);
            }}
            isLoading={createCluster.isPending}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editingCluster} onOpenChange={(open) => !open && setEditingCluster(null)}>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <DialogTitle>Edit Cluster</DialogTitle>
          </DialogHeader>
          {editingCluster && (
            <ClusterForm
              sessionId={sessionId}
              defaultValues={{
                name: editingCluster.name,
                description: editingCluster.description,
                color: editingCluster.color,
                tags: editingCluster.tags,
              }}
              onSubmit={(data) => {
                updateCluster.mutate({ clusterId: editingCluster._id, data });
                setEditingCluster(null);
              }}
              isLoading={updateCluster.isPending}
              onCancel={() => setEditingCluster(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deletingClusterId}
        onOpenChange={(open) => !open && setDeletingClusterId(null)}
        title="Delete Cluster"
        description="Are you sure you want to delete this cluster? The ideas will not be deleted."
        onConfirm={() => {
          if (deletingClusterId) {
            deleteCluster.mutate(deletingClusterId);
            setDeletingClusterId(null);
          }
        }}
        variant="destructive"
      />
    </div>
  );
}
