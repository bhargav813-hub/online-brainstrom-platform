'use client';

import { useMemo } from 'react';
import type { UserRole } from '@/constants/roles';

export interface Permissions {
  canManageSession: boolean;
  canDeleteBoard: boolean;
  canInviteMembers: boolean;
  canManageClusters: boolean;
  canEditOthersIdeas: boolean;
  canArchiveBoard: boolean;
  canAssignRoles: boolean;
}

export function usePermissions(role?: UserRole | null): Permissions {
  return useMemo(() => {
    if (!role) {
      return {
        canManageSession: false,
        canDeleteBoard: false,
        canInviteMembers: false,
        canManageClusters: false,
        canEditOthersIdeas: false,
        canArchiveBoard: false,
        canAssignRoles: false,
      };
    }

    return {
      canManageSession: ['facilitator', 'workspace_admin'].includes(role),
      canDeleteBoard: role === 'workspace_admin',
      canInviteMembers: role === 'workspace_admin',
      canManageClusters: ['facilitator', 'workspace_admin'].includes(role),
      canEditOthersIdeas: ['facilitator', 'workspace_admin'].includes(role),
      canArchiveBoard: ['facilitator', 'workspace_admin'].includes(role),
      canAssignRoles: role === 'workspace_admin',
    };
  }, [role]);
}
