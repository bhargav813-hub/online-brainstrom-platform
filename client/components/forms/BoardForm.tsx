'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBoardSchema, type CreateBoardInput } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface BoardFormProps {
  workspaceId: string;
  onSubmit: (data: CreateBoardInput) => void;
  isLoading?: boolean;
}

export function BoardForm({ workspaceId, onSubmit, isLoading }: BoardFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateBoardInput>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: { workspaceId },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="hidden" {...register('workspaceId')} />
      <div className="space-y-2">
        <Label htmlFor="board-title">Title</Label>
        <Input id="board-title" placeholder="Sprint Planning Board" {...register('title')} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="board-description">Description (optional)</Label>
        <Textarea id="board-description" placeholder="What topics will this board cover?" rows={3} {...register('description')} />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Board
      </Button>
    </form>
  );
}
