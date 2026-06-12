import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  activeWorkspaceId: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setActiveWorkspaceId: (id: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      theme: 'dark',
      activeWorkspaceId: null,

      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      setSidebarOpen: (isSidebarOpen) =>
        set({ isSidebarOpen }),

      setTheme: (theme) =>
        set({ theme }),

      setActiveWorkspaceId: (activeWorkspaceId) =>
        set({ activeWorkspaceId }),
    }),
    {
      name: 'brainstorm-ui',
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
        theme: state.theme,
        activeWorkspaceId: state.activeWorkspaceId,
      }),
    }
  )
);
