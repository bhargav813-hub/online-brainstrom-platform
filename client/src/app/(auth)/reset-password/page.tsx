import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Reset Password' };

export default function ResetPasswordPage() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Set new password</h2>
        <p className="mt-1 text-muted-foreground">Enter the code and your new password</p>
      </div>
      <Suspense><ResetPasswordForm /></Suspense>
    </>
  );
}
