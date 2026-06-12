'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useSocketStore } from '@/store/socket.store';
import { createSocket, disconnectSocket, getSocket } from '@/lib/socket';

export function SocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, accessToken } = useAuthStore();
  const { setConnected, setConnectionError } = useSocketStore();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      disconnectSocket();
      setConnected(false);
      return;
    }

    const socket = createSocket(accessToken);

    socket.on('connect', () => {
      setConnected(true);
      setConnectionError(null);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      setConnectionError(error.message);
      setConnected(false);
    });

    return () => {
      disconnectSocket();
      setConnected(false);
    };
  }, [isAuthenticated, accessToken, setConnected, setConnectionError]);

  return <>{children}</>;
}
