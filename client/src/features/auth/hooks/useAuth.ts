'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants/routes';
import type { LoginPayload, RegisterPayload, VerifyOtpPayload, ForgotPasswordPayload, ResetPasswordPayload } from '@/types/auth.types';

export function useLogin() {
  const router = useRouter();
  const { setAuth, setAccessToken } = useAuthStore();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: async (data) => {
      sessionStorage.setItem('refreshToken', data.refreshToken);
      setAccessToken(data.accessToken);
      const user = await userService.getMe();
      setAuth(user, data.accessToken);
      toast.success('Welcome back!');
      router.push(ROUTES.WORKSPACES);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to sign in');
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (_, variables) => {
      toast.success('Account created! Please verify your email.');
      router.push(`${ROUTES.VERIFY_OTP}?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}

export function useVerifyOtp() {
  const router = useRouter();
  const { setAuth, setAccessToken } = useAuthStore();

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authService.verifyOtp(payload),
    onSuccess: async (data) => {
      sessionStorage.setItem('refreshToken', data.refreshToken);
      setAccessToken(data.accessToken);
      const user = await userService.getMe();
      setAuth(user, data.accessToken);
      toast.success('Email verified! Welcome aboard.');
      router.push(ROUTES.WORKSPACES);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Verification failed');
    },
  });
}

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => authService.forgotPassword(payload),
    onSuccess: (_, variables) => {
      toast.success('Reset code sent to your email');
      router.push(`${ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset code');
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authService.resetPassword(payload),
    onSuccess: () => {
      toast.success('Password reset successfully!');
      router.push(ROUTES.LOGIN);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });
}
