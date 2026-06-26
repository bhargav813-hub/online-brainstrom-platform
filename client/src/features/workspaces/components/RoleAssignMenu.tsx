'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAssignRole } from '@/features/workspaces/hooks/useWorkspace';
import { ALL_ROLES, ROLE_DISPLAY_NAMES, type UserRole } from '@/constants/roles';
import { Shield, ChevronDown } from 'lucide-react';

interface RoleAssignMenuProps {
  workspaceId: string;
  userId: string;
  currentRole: UserRole;
}

export function RoleAssignMenu({ workspaceId, userId, currentRole }: RoleAssignMenuProps) {
  const assignRole = useAssignRole(workspaceId);

  const handleRoleChange = (role: UserRole) => {
    if (role === currentRole) return;
    assignRole.mutate({ userId, role });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs capitalize" disabled={assignRole.isPending}>
          <Shield className="h-3.5 w-3.5" />
          {currentRole.replace('_', ' ')}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {ALL_ROLES.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleRoleChange(role)}
            className={role === currentRole ? 'bg-accent font-medium' : ''}
          >
            {ROLE_DISPLAY_NAMES[role]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
