'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validators';
import { useAuthStore } from '@/store/auth.store';
import { userService } from '@/services/user.service';
import { PageContainer } from '@/components/layout/PageContainer';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name ?? '',
      avatar: user?.avatar ?? '',
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    setIsSubmitting(true);
    try {
      const updated = await userService.updateMe(data);
      setAuth(updated, useAuthStore.getState().accessToken!);
      toast.success('Profile updated!');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <PageContainer title="Profile" description="Manage your account settings">
      <div className="max-w-2xl">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-8">
              <UserAvatar name={user.name} avatar={user.avatar} size="lg" />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Name</Label>
                <Input id="profile-name" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-avatar">Avatar URL</Label>
                <Input id="profile-avatar" placeholder="https://example.com/avatar.png" {...register('avatar')} />
                {errors.avatar && <p className="text-xs text-destructive">{errors.avatar.message}</p>}
                <p className="text-[10px] text-muted-foreground">Enter a URL for your profile picture.</p>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
