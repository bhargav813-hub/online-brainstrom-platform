'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/FormField';
import { Plus, Loader2 } from 'lucide-react';
import { createWorkspaceSchema, type CreateWorkspaceFormData } from '../schemas/workspace.schemas';
import { useCreateWorkspace } from '../hooks/useWorkspace';

export function CreateWorkspaceModal() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
  });
  const createWorkspace = useCreateWorkspace();

  const onSubmit = (data: CreateWorkspaceFormData) => {
    createWorkspace.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25">
          <Plus className="mr-2 h-4 w-4" />
          New Workspace
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            id="ws-name"
            label="Name"
            placeholder="My Workspace"
            error={errors.name}
            register={register('name')}
          />
          <FormField
            id="ws-description"
            label="Description"
            placeholder="What's this workspace about?"
            error={errors.description}
            register={register('description')}
            multiline
          />
          <Button type="submit" className="w-full" disabled={createWorkspace.isPending}>
            {createWorkspace.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>
            ) : (
              'Create Workspace'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
