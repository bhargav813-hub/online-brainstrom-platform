'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, clearAuth, setLoading, setAccessToken } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = sessionStorage.getItem('refreshToken');
      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        const authData = await authService.refreshToken(refreshToken);
        sessionStorage.setItem('refreshToken', authData.refreshToken);
        setAccessToken(authData.accessToken);

        const user = await userService.getMe();
        setAuth(user, authData.accessToken);
      } catch {
        clearAuth();
      }
    };

    initAuth();
  }, [setAuth, clearAuth, setLoading, setAccessToken]);

  return <>{children}</>;
}
