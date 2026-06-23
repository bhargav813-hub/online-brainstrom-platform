'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreateCluster } from '@/features/clusters/hooks/useCluster';
import { Plus, Loader2 } from 'lucide-react';

const createClusterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  tags: z.string().optional(),
  color: z.string().optional(),
});

type CreateClusterData = z.infer<typeof createClusterSchema>;

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];

interface CreateClusterModalProps {
  sessionId: string;
}

export function CreateClusterModal({ sessionId }: CreateClusterModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const createCluster = useCreateCluster(sessionId);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateClusterData>({
    resolver: zodResolver(createClusterSchema),
  });

  const onSubmit = (data: CreateClusterData) => {
    createCluster.mutate(
      {
        name: data.name,
        sessionId,
        description: data.description || undefined,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        color: selectedColor,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <Plus className="h-4 w-4" />
          New Cluster
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Cluster</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cluster-name">Name</Label>
            <Input id="cluster-name" placeholder="e.g., User Experience" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cluster-desc">Description</Label>
            <Textarea id="cluster-desc" placeholder="What does this cluster group?" {...register('description')} rows={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cluster-tags">Tags (comma-separated)</Label>
            <Input id="cluster-tags" placeholder="ux, design, priority" {...register('tags')} />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`h-8 w-8 rounded-full ring-2 transition-transform ${selectedColor === c ? 'ring-foreground scale-110' : 'ring-transparent hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createCluster.isPending} className="bg-gradient-to-r from-violet-600 to-indigo-600">
              {createCluster.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : 'Create Cluster'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
