import { create } from 'zustand';

interface SocketState {
  isConnected: boolean;
  connectionError: string | null;
  activeSessionId: string | null;
  setConnected: (connected: boolean) => void;
  setConnectionError: (error: string | null) => void;
  setActiveSessionId: (sessionId: string | null) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  connectionError: null,
  activeSessionId: null,

  setConnected: (isConnected) =>
    set({ isConnected, connectionError: isConnected ? null : undefined }),

  setConnectionError: (connectionError) =>
    set({ connectionError }),

  setActiveSessionId: (activeSessionId) =>
    set({ activeSessionId }),
}));
