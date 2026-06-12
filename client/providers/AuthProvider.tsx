'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { getStoredRefreshToken, storeRefreshToken } from '@/services/api-client';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setAuth, clearAuth, setHydrating, isHydrating } = useAuthStore();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const refreshToken = getStoredRefreshToken();
        if (!refreshToken) {
          clearAuth();
          return;
        }

        const tokens = await authService.refreshToken(refreshToken);
        storeRefreshToken(tokens.refreshToken);

        // Set the token first so the next request has it
        useAuthStore.getState().setAccessToken(tokens.accessToken);

        // Fetch user profile
        const user = await userService.getMe();
        setAuth(user, tokens.accessToken);
      } catch {
        clearAuth();
      }
    };

    hydrate();
  }, [setAuth, clearAuth, setHydrating]);

  if (isHydrating) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
