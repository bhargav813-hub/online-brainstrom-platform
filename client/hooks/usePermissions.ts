import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { workspaceService } from '@/services/workspace.service';
import { queryKeys } from '@/lib/queryKeys';
import type { UserRole } from '@/types/common';

export function usePermissions(workspaceId: string) {
  const { user } = useAuthStore();

  const { data: workspace, isPending } = useQuery({
    queryKey: queryKeys.workspaces.detail(workspaceId),
    queryFn: () => workspaceService.getById(workspaceId),
    enabled: !!workspaceId && !!user,
  });

  const isOwner = workspace?.owner._id === user?._id;
  const memberEntry = workspace?.members.find((m) => m.user._id === user?._id);
  const role: UserRole | null = isOwner ? 'workspace_admin' : (memberEntry?.role ?? null);

  return {
    role,
    isOwner,
    isPending,
    canManageWorkspace: role === 'workspace_admin',
    canInviteMembers: role === 'workspace_admin' || role === 'facilitator',
    canManageSessions: role === 'workspace_admin' || role === 'facilitator',
    canManageClusters: role === 'workspace_admin' || role === 'facilitator',
    canArchiveBoards: role === 'workspace_admin' || role === 'facilitator',
    isMember: !!role,
  };
}
