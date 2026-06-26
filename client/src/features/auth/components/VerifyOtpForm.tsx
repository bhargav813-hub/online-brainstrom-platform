'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVerifyOtp } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/forms/OtpInput';
import { Loader2, Mail } from 'lucide-react';

export function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const verifyOtp = useVerifyOtp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      verifyOtp.mutate({ email, otp });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
          <Mail className="h-7 w-7 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to
          </p>
          <p className="font-medium">{email}</p>
        </div>
      </div>

      <OtpInput value={otp} onChange={setOtp} disabled={verifyOtp.isPending} />

      {verifyOtp.error && (
        <p className="text-center text-sm text-destructive" role="alert">
          {(verifyOtp.error as Error).message}
        </p>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25"
        disabled={otp.length < 6 || verifyOtp.isPending}
      >
        {verifyOtp.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify email'
        )}
      </Button>
    </form>
  );
}
