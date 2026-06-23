'use client';

import { UserAvatar } from '@/components/shared/UserAvatar';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserMinus, Shield } from 'lucide-react';
import { useRemoveMember, useAssignRole } from '../hooks/useWorkspace';
import { ALL_ROLES, ROLE_DISPLAY_NAMES, type UserRole } from '@/constants/roles';
import type { WorkspaceMember } from '@/types/workspace.types';
import { usePermissions } from '@/hooks/usePermissions';
import { formatRelativeTime } from '@/lib/formatters';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';

interface MemberListProps {
  members: WorkspaceMember[];
  workspaceId: string;
  currentUserRole?: UserRole | null;
}

export function MemberList({ members, workspaceId, currentUserRole }: MemberListProps) {
  const { canAssignRoles, canInviteMembers } = usePermissions(currentUserRole);
  const removeMember = useRemoveMember(workspaceId);
  const assignRole = useAssignRole(workspaceId);
  const [removeUserId, setRemoveUserId] = useState<string | null>(null);

  return (
    <>
      <div className="space-y-2">
        {members.map((member) => {
          const user = typeof member.user === 'string' ? null : member.user;
          if (!user) return null;

          return (
            <div
              key={user._id}
              className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50"
            >
              <UserAvatar name={user.name} avatar={user.avatar} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <RoleBadge role={member.role} />
              <span className="hidden text-xs text-muted-foreground sm:block">
                {formatRelativeTime(member.joinedAt)}
              </span>
              {canInviteMembers && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canAssignRoles &&
                      ALL_ROLES.filter((r) => r !== member.role).map((r) => (
                        <DropdownMenuItem
                          key={r}
                          onClick={() => assignRole.mutate({ userId: user._id, role: r })}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Set {ROLE_DISPLAY_NAMES[r]}
                        </DropdownMenuItem>
                      ))}
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setRemoveUserId(user._id)}
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={!!removeUserId}
        onOpenChange={() => setRemoveUserId(null)}
        title="Remove Member"
        description="Are you sure you want to remove this member from the workspace?"
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={() => {
          if (removeUserId) {
            removeMember.mutate(removeUserId);
            setRemoveUserId(null);
          }
        }}
        loading={removeMember.isPending}
      />
    </>
  );
}
