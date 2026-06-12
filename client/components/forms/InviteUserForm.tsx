'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inviteUserSchema, type InviteUserInput } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ALL_ROLES, ROLE_LABELS } from '@/constants/roles';
import { Loader2, UserPlus } from 'lucide-react';

interface InviteUserFormProps {
  onSubmit: (data: InviteUserInput) => void;
  isLoading?: boolean;
}

export function InviteUserForm({ onSubmit, isLoading }: InviteUserFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<InviteUserInput>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: { role: 'participant' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="invite-email">Email address</Label>
        <Input id="invite-email" type="email" placeholder="colleague@company.com" {...register('email')} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label>Role</Label>
        <Select defaultValue="participant" onValueChange={(val) => setValue('role', val as InviteUserInput['role'])}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {ALL_ROLES.map((role) => (
              <SelectItem key={role} value={role}>{ROLE_LABELS[role]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
        Send Invite
      </Button>
    </form>
  );
}
