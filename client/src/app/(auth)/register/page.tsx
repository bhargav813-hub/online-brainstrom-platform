import { RegisterForm } from '@/features/auth/components/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Create Account' };

export default function RegisterPage() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Create your account</h2>
        <p className="mt-1 text-muted-foreground">Start brainstorming with your team</p>
      </div>
      <RegisterForm />
    </>
  );
}
