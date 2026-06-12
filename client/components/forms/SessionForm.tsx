'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSessionSchema, type CreateSessionInput } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface SessionFormProps {
  boardId: string;
  workspaceId: string;
  onSubmit: (data: CreateSessionInput) => void;
  isLoading?: boolean;
}

export function SessionForm({ boardId, workspaceId, onSubmit, isLoading }: SessionFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: { boardId, workspaceId },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="hidden" {...register('boardId')} />
      <input type="hidden" {...register('workspaceId')} />
      <div className="space-y-2">
        <Label htmlFor="session-title">Title</Label>
        <Input id="session-title" placeholder="Brainstorming Session" {...register('title')} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="session-description">Description (optional)</Label>
        <Textarea id="session-description" placeholder="What's the goal of this session?" rows={3} {...register('description')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="session-max">Max Participants (optional)</Label>
        <Input id="session-max" type="number" min={2} max={100} placeholder="20" {...register('maxParticipants', { valueAsNumber: true })} />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Session
      </Button>
    </form>
  );
}
