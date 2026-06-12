'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ALL_ROLES, ROLE_LABELS } from '@/constants/roles';
import { formatRelativeTime } from '@/lib/utils';
import { UserMinus } from 'lucide-react';
import type { WorkspaceMember, User } from '@/types/models';
import type { UserRole } from '@/types/common';

interface MembersTableProps {
  owner: User;
  members: WorkspaceMember[];
  canManage?: boolean;
  onRoleChange?: (userId: string, role: UserRole) => void;
  onRemove?: (userId: string) => void;
}

export function MembersTable({
  owner,
  members,
  canManage = false,
  onRoleChange,
  onRemove,
}: MembersTableProps) {
  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-[300px]">Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            {canManage && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Owner row */}
          <TableRow className="bg-primary/[0.02]">
            <TableCell>
              <div className="flex items-center gap-3">
                <UserAvatar name={owner.name} avatar={owner.avatar} />
                <div>
                  <p className="text-sm font-medium">{owner.name}</p>
                  <p className="text-xs text-muted-foreground">{owner.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <RoleBadge role="workspace_admin" />
            </TableCell>
            <TableCell>
              <span className="text-xs text-muted-foreground">Owner</span>
            </TableCell>
            {canManage && <TableCell />}
          </TableRow>

          {/* Member rows */}
          {members.map((member) => (
            <TableRow key={member.user._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <UserAvatar name={member.user.name} avatar={member.user.avatar} />
                  <div>
                    <p className="text-sm font-medium">{member.user.name}</p>
                    <p className="text-xs text-muted-foreground">{member.user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {canManage && onRoleChange ? (
                  <Select
                    defaultValue={member.role}
                    onValueChange={(val) => onRoleChange(member.user._id, val as UserRole)}
                  >
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_ROLES.map((role) => (
                        <SelectItem key={role} value={role} className="text-xs">
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <RoleBadge role={member.role} />
                )}
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(member.joinedAt)}
                </span>
              </TableCell>
              {canManage && (
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove?.(member.user._id)}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
