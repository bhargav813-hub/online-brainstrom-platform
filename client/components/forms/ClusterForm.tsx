'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClusterSchema, type CreateClusterInput, type UpdateClusterInput } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface ClusterFormProps {
  sessionId: string;
  defaultValues?: Partial<UpdateClusterInput & { name: string }>;
  onSubmit: (data: CreateClusterInput | UpdateClusterInput) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

const colorOptions = [
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
  '#f43f5e', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
];

export function ClusterForm({ sessionId, defaultValues, onSubmit, isLoading, onCancel }: ClusterFormProps) {
  const isEditing = !!defaultValues;
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateClusterInput>({
    resolver: zodResolver(createClusterSchema),
    defaultValues: {
      sessionId,
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      color: defaultValues?.color ?? colorOptions[0],
      tags: defaultValues?.tags ?? [],
    },
  });

  const selectedColor = watch('color');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('sessionId')} />

      <div className="space-y-2">
        <Label htmlFor="cluster-name">Name</Label>
        <Input id="cluster-name" placeholder="Cluster name" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cluster-desc">Description</Label>
        <Textarea id="cluster-desc" placeholder="Optional description" rows={2} {...register('description')} />
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color}
              type="button"
              className={`h-7 w-7 rounded-full border-2 transition-all ${
                selectedColor === color ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setValue('color', color)}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update' : 'Create'} Cluster
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </form>
  );
}
