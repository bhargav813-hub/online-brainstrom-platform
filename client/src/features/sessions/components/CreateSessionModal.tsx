'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/FormField';
import { Plus, Loader2 } from 'lucide-react';
import { createSessionSchema, type CreateSessionFormData } from '../schemas/session.schemas';
import { useCreateSession } from '../hooks/useSession';

interface CreateSessionModalProps {
  boardId: string;
  workspaceId: string;
}

export function CreateSessionModal({ boardId, workspaceId }: CreateSessionModalProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateSessionFormData>({
    resolver: zodResolver(createSessionSchema) as any,
  });
  const createSession = useCreateSession(boardId);

  const onSubmit = (data: CreateSessionFormData) => {
    createSession.mutate(
      { title: data.title, boardId, workspaceId, description: data.description, maxParticipants: data.maxParticipants },
      { onSuccess: () => { setOpen(false); reset(); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25">
          <Plus className="mr-2 h-4 w-4" />New Session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Session</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField id="session-title" label="Title" placeholder="Brainstorming Session" error={errors.title} register={register('title')} />
          <FormField id="session-desc" label="Description" placeholder="Session description..." error={errors.description} register={register('description')} multiline />
          <FormField id="session-max" label="Max Participants" type="number" placeholder="10" error={errors.maxParticipants} register={register('maxParticipants')} />
          <Button type="submit" className="w-full" disabled={createSession.isPending}>
            {createSession.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : 'Create Session'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
