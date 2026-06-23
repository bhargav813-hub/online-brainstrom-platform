'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIdeaSchema, type CreateIdeaFormData } from '../schemas/idea.schemas';
import { useCreateIdea } from '../hooks/useIdeas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateIdeaFormProps {
  sessionId: string;
  parentIdeaId?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export function CreateIdeaForm({ sessionId, parentIdeaId, onSuccess, compact }: CreateIdeaFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateIdeaFormData>({
    resolver: zodResolver(createIdeaSchema),
  });
  const createIdea = useCreateIdea(sessionId);

  const onSubmit = (data: CreateIdeaFormData) => {
    createIdea.mutate(
      { title: data.title, sessionId, content: data.content, parentIdeaId, tags: data.tags?.split(',').map((t) => t.trim()).filter(Boolean) },
      { onSuccess: () => { reset(); onSuccess?.(); } }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-3', compact ? 'p-2' : 'rounded-xl border bg-card p-4')}>
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-500 shrink-0" />
        <Input placeholder={compact ? 'Add sub-idea...' : 'What\'s your idea?'} {...register('title')} className={cn('flex-1', errors.title && 'border-destructive')} />
      </div>
      {!compact && (
        <>
          <Textarea placeholder="Describe your idea (optional)..." {...register('content')} rows={2} />
          <Input placeholder="Tags (comma-separated)" {...register('tags')} />
        </>
      )}
      <Button type="submit" size={compact ? 'sm' : 'default'} disabled={createIdea.isPending} className={cn(!compact && 'w-full')}>
        {createIdea.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Add Idea
      </Button>
    </form>
  );
}
