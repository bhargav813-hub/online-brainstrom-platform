'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInviteToSession } from '@/features/sessions/hooks/useSessions';
import { Mail, UserPlus, Loader2 } from 'lucide-react';

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type InviteInput = z.infer<typeof inviteSchema>;

interface InviteToSessionDialogProps {
  sessionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteToSessionDialog({
  sessionId,
  open,
  onOpenChange,
}: InviteToSessionDialogProps) {
  const invite = useInviteToSession(sessionId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteInput>({ resolver: zodResolver(inviteSchema) });

  const onSubmit = (data: InviteInput) => {
    invite.mutate(data.email, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-strong border-border/30">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-md">
              <UserPlus className="h-4 w-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">Add Member to Session</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                The user must already be a member of this workspace.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="invite-email"
                type="email"
                placeholder="member@example.com"
                className="pl-9"
                autoComplete="off"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => { reset(); onOpenChange(false); }}
              disabled={invite.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={invite.isPending} className="gap-1.5">
              {invite.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <UserPlus className="h-3.5 w-3.5" />
              )}
              Add to Session
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
