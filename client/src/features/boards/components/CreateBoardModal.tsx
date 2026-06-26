'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/FormField';
import { Plus, Loader2 } from 'lucide-react';
import { createBoardSchema, type CreateBoardFormData } from '../schemas/board.schemas';
import { useCreateBoard } from '../hooks/useBoard';

interface CreateBoardModalProps {
  workspaceId: string;
}

export function CreateBoardModal({ workspaceId }: CreateBoardModalProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardSchema),
  });
  const createBoard = useCreateBoard(workspaceId);

  const onSubmit = (data: CreateBoardFormData) => {
    createBoard.mutate({ ...data, workspaceId }, {
      onSuccess: () => { setOpen(false); reset(); },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25">
          <Plus className="mr-2 h-4 w-4" />New Board
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Board</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField id="board-name" label="Name" placeholder="Sprint Retrospective" error={errors.name} register={register('name')} />
          <FormField id="board-description" label="Description" placeholder="Board description..." error={errors.description} register={register('description')} multiline />
          <Button type="submit" className="w-full" disabled={createBoard.isPending}>
            {createBoard.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : 'Create Board'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
