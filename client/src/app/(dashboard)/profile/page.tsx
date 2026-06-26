'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/FormField';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { useAuthStore } from '@/store/auth.store';
import { userService } from '@/services/user.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';


const profileSchema = z.object({ name: z.string().min(2).max(50), avatar: z.string().url().optional().or(z.literal('')) });
const passwordSchema = z.object({ currentPassword: z.string().min(6), newPassword: z.string().min(6), confirmPassword: z.string() }).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();

  const profileForm = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema), defaultValues: { name: user?.name || '', avatar: user?.avatar || '' } });
  const passwordForm = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  const updateProfile = useMutation({
    mutationFn: (data: ProfileFormData) => userService.updateProfile(data),
    onSuccess: (data) => { setUser(data); toast.success('Profile updated!'); },
  });

  const changePassword = useMutation({
    mutationFn: (data: PasswordFormData) => userService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
    onSuccess: () => { passwordForm.reset(); toast.success('Password changed!'); },
  });

  return (
    <PageContainer title="Profile" description="Manage your account settings">
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center gap-4">
              <UserAvatar name={user?.name || 'User'} avatar={user?.avatar} size="lg" />
              <div><p className="font-medium">{user?.name}</p><p className="text-sm text-muted-foreground">{user?.email}</p></div>
            </div>
            <form onSubmit={profileForm.handleSubmit((d) => updateProfile.mutate(d))} className="space-y-4">
              <FormField id="profile-name" label="Name" error={profileForm.formState.errors.name} register={profileForm.register('name')} />
              <FormField id="profile-avatar" label="Avatar URL" placeholder="https://..." error={profileForm.formState.errors.avatar} register={profileForm.register('avatar')} />
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit((d) => changePassword.mutate(d))} className="space-y-4">
              <FormField id="current-password" label="Current Password" type="password" error={passwordForm.formState.errors.currentPassword} register={passwordForm.register('currentPassword')} />
              <FormField id="new-password" label="New Password" type="password" error={passwordForm.formState.errors.newPassword} register={passwordForm.register('newPassword')} />
              <FormField id="confirm-new-password" label="Confirm New Password" type="password" error={passwordForm.formState.errors.confirmPassword} register={passwordForm.register('confirmPassword')} />
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
