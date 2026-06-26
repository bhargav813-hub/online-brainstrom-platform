'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { boardService } from '@/services/board.service';
import { queryKeys } from '@/constants/query-keys';
import type { CreateBoardPayload, UpdateBoardPayload, ExportFormat } from '@/types/board.types';

export function useBoards(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.boards.byWorkspace(workspaceId),
    queryFn: () => boardService.getByWorkspace(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useBoard(boardId: string) {
  return useQuery({
    queryKey: queryKeys.boards.detail(boardId),
    queryFn: () => boardService.getById(boardId),
    enabled: !!boardId,
  });
}

export function useCreateBoard(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBoardPayload) => boardService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.byWorkspace(workspaceId) });
      toast.success('Board created!');
    },
  });
}

export function useUpdateBoard(boardId: string, workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateBoardPayload) => boardService.update(boardId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(boardId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.byWorkspace(workspaceId) });
      toast.success('Board updated!');
    },
  });
}

export function useArchiveBoard(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: string) => boardService.archive(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.byWorkspace(workspaceId) });
      toast.success('Board archived');
    },
  });
}

export function useUnarchiveBoard(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: string) => boardService.unarchive(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.byWorkspace(workspaceId) });
      toast.success('Board restored');
    },
  });
}

export function useDeleteBoard(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: string) => boardService.delete(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.byWorkspace(workspaceId) });
      toast.success('Board deleted');
    },
  });
}

export function useShareBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: string) => boardService.share(boardId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(data._id) });
      toast.success('Board shared! Link copied.');
    },
  });
}

export function useUnshareBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: string) => boardService.unshare(boardId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(data._id) });
      toast.success('Board sharing disabled');
    },
  });
}

export function useSharedBoard(shareToken: string) {
  return useQuery({
    queryKey: queryKeys.boards.shared(shareToken),
    queryFn: () => boardService.getShared(shareToken),
    enabled: !!shareToken,
  });
}

export function useExportBoard() {
  return useMutation({
    mutationFn: ({ boardId, format }: { boardId: string; format: ExportFormat }) =>
      boardService.exportBoard(boardId, format),
    onSuccess: (data, { format }) => {
      if (format === 'pdf' && data instanceof Blob) {
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `board-export.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Board exported as PDF');
      } else {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `board-export.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Board exported as JSON');
      }
    },
  });
}
