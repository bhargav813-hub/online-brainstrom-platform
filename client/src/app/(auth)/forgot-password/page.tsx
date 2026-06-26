import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Forgot Password' };

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Reset your password</h2>
        <p className="mt-1 text-muted-foreground">We&apos;ll send you a verification code</p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
