'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../schemas/auth.schemas';
import { useRegister } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/FormField';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const registerMutation = useRegister();

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate({ name: data.name, email: data.email, password: data.password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        id="name"
        label="Full Name"
        placeholder="John Doe"
        error={errors.name}
        register={register('name')}
      />
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
      <FormField
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword}
        register={register('confirmPassword')}
      />

      {registerMutation.error && (
        <p className="text-sm text-destructive" role="alert">
          {(registerMutation.error as Error).message}
        </p>
      )}

      <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href={ROUTES.LOGIN} className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">
          Sign in
        </Link>
      </p>
    </form>
  );
}
