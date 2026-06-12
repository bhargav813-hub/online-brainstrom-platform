'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { workspaceService } from '@/services/workspace.service';
import { queryKeys } from '@/lib/queryKeys';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ALL_ROLES, ROLE_LABELS } from '@/constants/roles';
import { Mail, UserMinus, UserPlus, Loader2 } from 'lucide-react';
import type { Workspace } from '@/types/models';
import type { UserRole } from '@/types/common';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { inviteUserSchema, type InviteUserInput } from '@/lib/validators';

interface MemberManagementProps {
  workspace: Workspace;
  canManage: boolean;
}

export function MemberManagement({ workspace, canManage }: MemberManagementProps) {
  const queryClient = useQueryClient();
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InviteUserInput>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: { role: 'participant' },
  });

  const inviteRole = watch('role');

  const inviteMutation = useMutation({
    mutationFn: (data: InviteUserInput) => workspaceService.invite(workspace._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.detail(workspace._id) });
      toast.success('Member invited successfully!');
      reset({ role: 'participant' });
    },
    onError: (error: { message: string }) => toast.error(error.message || 'Failed to invite member'),
  });

  const assignRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      workspaceService.assignRole(workspace._id, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.detail(workspace._id) });
      toast.success('Role updated');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => workspaceService.removeMember(workspace._id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.detail(workspace._id) });
      toast.success('Member removed');
      setRemovingUserId(null);
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">

      {/* ── Invite Form (admins/facilitators only) ── */}
      {canManage && (
        <div className="rounded-xl border border-border/50 bg-card/40 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-sm">
              <UserPlus className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Invite a Member</p>
              <p className="text-xs text-muted-foreground">
                The person must have a registered account.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit((data) => inviteMutation.mutate(data))} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1">
              <Label htmlFor="invite-email" className="sr-only">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@example.com"
                  className="pl-9"
                  autoComplete="off"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Select
              value={inviteRole ?? 'participant'}
              onValueChange={(val) => setValue('role', val as UserRole)}
            >
              <SelectTrigger className="w-full sm:w-[150px] h-10 text-sm">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {ALL_ROLES.map((role) => (
                  <SelectItem key={role} value={role} className="text-sm">
                    {ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="submit" disabled={inviteMutation.isPending} className="gap-1.5 shrink-0">
              {inviteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Invite
            </Button>
          </form>
        </div>
      )}

      {/* ── Members List ── */}
      <div className="space-y-1">
        {/* Owner */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-center gap-3">
          <UserAvatar name={workspace.owner.name} avatar={workspace.owner.avatar} />
          <div>
            <p className="text-sm font-medium">{workspace.owner.name}</p>
            <p className="text-xs text-muted-foreground">{workspace.owner.email}</p>
          </div>
        </div>
        <RoleBadge role="workspace_admin" />
      </div>

      {/* Members */}
      {workspace.members.map((member) => (
        <div key={member.user._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
          <div className="flex items-center gap-3">
            <UserAvatar name={member.user.name} avatar={member.user.avatar} />
            <div>
              <p className="text-sm font-medium">{member.user.name}</p>
              <p className="text-xs text-muted-foreground">{member.user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canManage ? (
              <>
                <Select
                  defaultValue={member.role}
                  onValueChange={(val) =>
                    assignRoleMutation.mutate({ userId: member.user._id, role: val as UserRole })
                  }
                >
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_ROLES.map((role) => (
                      <SelectItem key={role} value={role} className="text-xs">{ROLE_LABELS[role]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setRemovingUserId(member.user._id)}
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <RoleBadge role={member.role} />
            )}
          </div>
        </div>
      ))}
      </div>{/* end members list */}

      <ConfirmDialog
        open={!!removingUserId}
        onOpenChange={() => setRemovingUserId(null)}
        title="Remove member"
        description="This member will lose access to this workspace."
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={() => removingUserId && removeMemberMutation.mutate(removingUserId)}
        loading={removeMemberMutation.isPending}
      />
    </div>
  );
}
