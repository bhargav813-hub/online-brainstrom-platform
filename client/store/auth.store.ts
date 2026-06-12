import { create } from 'zustand';
import type { User } from '@/types/models';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setHydrating: (hydrating: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrating: true,

  setAuth: (user, accessToken) =>
    set({ user, accessToken, isAuthenticated: true, isHydrating: false }),

  setAccessToken: (accessToken) =>
    set({ accessToken }),

  setUser: (user) =>
    set({ user }),

  clearAuth: () =>
    set({ user: null, accessToken: null, isAuthenticated: false, isHydrating: false }),

  setHydrating: (isHydrating) =>
    set({ isHydrating }),
}));
