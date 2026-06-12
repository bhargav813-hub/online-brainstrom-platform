'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { storeRefreshToken, clearStoredRefreshToken } from '@/services/api-client';
import { userService } from '@/services/user.service';
import { ROUTES } from '@/constants/routes';
import type { LoginInput, RegisterInput } from '@/lib/validators';

export function useAuth() {
  const router = useRouter();
  const { setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      storeRefreshToken(data.refreshToken);
      toast.success('Welcome back!');
      router.push(ROUTES.WORKSPACES);
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      storeRefreshToken(data.refreshToken);
      toast.success('Account created successfully!');
      router.push(ROUTES.WORKSPACES);
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Registration failed');
    },
  });

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Clear auth even on failure
    } finally {
      clearAuth();
      clearStoredRefreshToken();
      router.push(ROUTES.LOGIN);
    }
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}
