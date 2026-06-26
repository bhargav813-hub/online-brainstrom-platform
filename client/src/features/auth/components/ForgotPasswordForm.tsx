'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/auth.schemas';
import { useForgotPassword } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/FormField';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function ForgotPasswordForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const forgot = useForgotPassword();

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgot.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email}
        register={register('email')}
      />

      {forgot.error && (
        <p className="text-sm text-destructive" role="alert">
          {(forgot.error as Error).message}
        </p>
      )}

      <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25" disabled={forgot.isPending}>
        {forgot.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Send reset code'
        )}
      </Button>

      <Link
        href={ROUTES.LOGIN}
        className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>
    </form>
  );
}
