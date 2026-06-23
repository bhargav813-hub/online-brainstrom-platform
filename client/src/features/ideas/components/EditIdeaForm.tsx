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
import { useUpdateIdea } from '@/features/ideas/hooks/useIdeas';
import { Pencil, Loader2 } from 'lucide-react';
import type { Idea } from '@/types/idea.types';

const editIdeaSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().max(2000).optional(),
  tags: z.string().optional(),
  changeNote: z.string().max(200).optional(),
});

type EditIdeaFormData = z.infer<typeof editIdeaSchema>;

interface EditIdeaFormProps {
  idea: Idea;
  sessionId: string;
}

export function EditIdeaForm({ idea, sessionId }: EditIdeaFormProps) {
  const [open, setOpen] = useState(false);
  const updateIdea = useUpdateIdea(sessionId);

  const { register, handleSubmit, formState: { errors } } = useForm<EditIdeaFormData>({
    resolver: zodResolver(editIdeaSchema),
    defaultValues: {
      title: idea.title,
      content: idea.content || '',
      tags: idea.tags?.join(', ') || '',
      changeNote: '',
    },
  });

  const onSubmit = (data: EditIdeaFormData) => {
    updateIdea.mutate(
      {
        ideaId: idea._id,
        payload: {
          title: data.title,
          content: data.content || undefined,
          tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
          changeNote: data.changeNote || undefined,
        },
      },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Idea</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input id="edit-title" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-content">Content</Label>
            <Textarea id="edit-content" {...register('content')} rows={3} placeholder="Describe your idea..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
            <Input id="edit-tags" {...register('tags')} placeholder="design, ux, feature" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-changeNote">Change note (optional)</Label>
            <Input id="edit-changeNote" {...register('changeNote')} placeholder="What changed?" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={updateIdea.isPending} className="bg-gradient-to-r from-violet-600 to-indigo-600">
              {updateIdea.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
