import { LoginForm } from '@/features/auth/components/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign In' };

export default function LoginPage() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Welcome back</h2>
        <p className="mt-1 text-muted-foreground">Sign in to your account</p>
      </div>
      <LoginForm />
    </>
  );
}
