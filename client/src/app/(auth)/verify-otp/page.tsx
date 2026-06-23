import { VerifyOtpForm } from '@/features/auth/components/VerifyOtpForm';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Verify Email' };

export default function VerifyOtpPage() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Verify your email</h2>
        <p className="mt-1 text-muted-foreground">Enter the code we sent you</p>
      </div>
      <Suspense><VerifyOtpForm /></Suspense>
    </>
  );
}
