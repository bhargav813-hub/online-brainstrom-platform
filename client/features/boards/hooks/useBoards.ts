'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { boardService } from '@/services/board.service';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/constants/queryConfig';
import type { CreateBoardInput } from '@/lib/validators';

export function useBoards(workspaceId: string, includeArchived = false) {
  return useQuery({
    queryKey: [...queryKeys.boards.byWorkspace(workspaceId), includeArchived],
    queryFn: () => boardService.getByWorkspace(workspaceId, includeArchived),
    enabled: !!workspaceId,
    staleTime: QUERY_CONFIG.staleTime.board,
  });
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: queryKeys.boards.detail(id),
    queryFn: () => boardService.getById(id),
    enabled: !!id,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBoardInput) => boardService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.byWorkspace(variables.workspaceId) });
      toast.success('Board created!');
    },
    onError: (error: { message: string }) => toast.error(error.message),
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
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useUnarchiveBoard(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: string) => boardService.unarchive(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.byWorkspace(workspaceId) });
      toast.success('Board unarchived');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useToggleGuestAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, enabled }: { boardId: string; enabled: boolean }) =>
      boardService.toggleGuestAccess(boardId, enabled),
    onSuccess: (updatedBoard) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(updatedBoard._id) });
      toast.success(`Guest access ${updatedBoard.guestAccessEnabled ? 'enabled' : 'disabled'}`);
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}
