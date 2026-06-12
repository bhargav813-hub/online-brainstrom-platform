'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/forms/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Zap } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function LoginPage() {
  const { login, isLoginLoading } = useAuth();

  return (
    <Card className="glass-strong shadow-2xl border-border/30">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-lg glow">
            <Zap className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-heading">Welcome back</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to continue brainstorming
        </p>
      </CardHeader>
      <CardContent>
        <LoginForm onSubmit={login} isLoading={isLoginLoading} />
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <Link href={ROUTES.REGISTER} className="text-primary hover:underline font-medium">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
