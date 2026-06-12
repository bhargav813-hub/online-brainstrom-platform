'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIdeaSchema, type CreateIdeaInput } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Loader2, Send } from 'lucide-react';

interface IdeaFormProps {
  sessionId: string;
  parentIdeaId?: string;
  onSubmit: (data: CreateIdeaInput) => void;
  isLoading?: boolean;
  compact?: boolean;
  onCancel?: () => void;
}

export function IdeaForm({ sessionId, parentIdeaId, onSubmit, isLoading, compact, onCancel }: IdeaFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateIdeaInput>({
    resolver: zodResolver(createIdeaSchema),
    defaultValues: { sessionId, parentIdeaId },
  });

  const handleFormSubmit = (data: CreateIdeaInput) => {
    onSubmit(data);
    reset({ sessionId, parentIdeaId, title: '', content: '' });
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex items-center gap-2">
        <input type="hidden" {...register('sessionId')} />
        {parentIdeaId && <input type="hidden" {...register('parentIdeaId')} />}
        <div className="relative flex-1">
          <Lightbulb className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={parentIdeaId ? 'Reply with an idea...' : 'Add an idea...'}
            className="pl-9 pr-10"
            {...register('title')}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          </Button>
        </div>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <input type="hidden" {...register('sessionId')} />
      {parentIdeaId && <input type="hidden" {...register('parentIdeaId')} />}
      <div className="space-y-2">
        <Input placeholder="Idea title" {...register('title')} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Textarea placeholder="Describe your idea (optional)" rows={3} {...register('content')} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Idea
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </form>
  );
}
