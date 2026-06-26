'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inviteMemberSchema, type InviteMemberFormData } from '../schemas/workspace.schemas';
import { useInviteMember } from '../hooks/useWorkspace';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/FormField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus } from 'lucide-react';
import { ALL_ROLES, ROLE_DISPLAY_NAMES, type UserRole } from '@/constants/roles';
import { useState } from 'react';

interface InviteMemberFormProps {
  workspaceId: string;
}

export function InviteMemberForm({ workspaceId }: InviteMemberFormProps) {
  const [role, setRole] = useState<UserRole>('participant');
  const { register, handleSubmit, formState: { errors }, reset } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
  });
  const invite = useInviteMember(workspaceId);

  const onSubmit = (data: InviteMemberFormData) => {
    invite.mutate({ email: data.email, role }, {
      onSuccess: () => reset(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <FormField
          id="invite-email"
          label="Email Address"
          type="email"
          placeholder="colleague@example.com"
          error={errors.email}
          register={register('email')}
        />
      </div>
      <div className="w-full sm:w-40">
        <Label className="text-sm font-medium">Role</Label>
        <Select value={role} onValueChange={(v) => v && setRole(v as UserRole)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALL_ROLES.map((r) => (
              <SelectItem key={r} value={r}>{ROLE_DISPLAY_NAMES[r]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={invite.isPending} className="shrink-0">
        {invite.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
        Invite
      </Button>
    </form>
  );
}
