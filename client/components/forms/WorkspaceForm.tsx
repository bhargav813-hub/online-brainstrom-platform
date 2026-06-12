'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWorkspaceSchema, type CreateWorkspaceInput } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface WorkspaceFormProps {
  onSubmit: (data: CreateWorkspaceInput) => void;
  isLoading?: boolean;
  defaultValues?: Partial<CreateWorkspaceInput>;
  submitLabel?: string;
}

export function WorkspaceForm({ onSubmit, isLoading, defaultValues, submitLabel = 'Create Workspace' }: WorkspaceFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="workspace-name">Name</Label>
        <Input id="workspace-name" placeholder="My Workspace" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="workspace-description">Description (optional)</Label>
        <Textarea id="workspace-description" placeholder="What's this workspace for?" rows={3} {...register('description')} />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
