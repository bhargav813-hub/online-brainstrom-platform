'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas/auth.schemas';
import { useLogin } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/FormField';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const login = useLogin();

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
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
      <FormField
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password}
        register={register('password')}
      />

      <div className="flex items-center justify-end">
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400"
        >
          Forgot password?
        </Link>
      </div>

      {login.error && (
        <p className="text-sm text-destructive" role="alert">
          {(login.error as Error).message}
        </p>
      )}

      <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25" disabled={login.isPending}>
        {login.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href={ROUTES.REGISTER} className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">
          Sign up
        </Link>
      </p>
    </form>
  );
}
