'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/auth.schemas';
import { useResetPassword } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/FormField';
import { OtpInput } from '@/components/forms/OtpInput';
import { Loader2 } from 'lucide-react';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email },
  });
  const reset = useResetPassword();

  const onSubmit = (data: ResetPasswordFormData) => {
    reset.mutate({ ...data, otp, email });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-medium">Verification Code</p>
        <OtpInput value={otp} onChange={setOtp} disabled={reset.isPending} />
      </div>

      <FormField
        id="password"
        label="New Password"
        type="password"
        placeholder="••••••••"
        error={errors.password}
        register={register('password')}
      />
      <FormField
        id="confirmPassword"
        label="Confirm New Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword}
        register={register('confirmPassword')}
      />

      {reset.error && (
        <p className="text-sm text-destructive" role="alert">
          {(reset.error as Error).message}
        </p>
      )}

      <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25" disabled={otp.length < 6 || reset.isPending}>
        {reset.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting...
          </>
        ) : (
          'Reset password'
        )}
      </Button>
    </form>
  );
}
