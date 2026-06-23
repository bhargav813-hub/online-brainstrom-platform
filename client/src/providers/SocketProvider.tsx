'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createSocket, type AppSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/auth.store';
import { useSocketStore } from '@/store/socket.store';

const SocketContext = createContext<AppSocket | null>(null);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<AppSocket | null>(null);
  const { accessToken, isAuthenticated } = useAuthStore();
  const { setStatus } = useSocketStore();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      setStatus('disconnected');
      return;
    }

    const newSocket = createSocket(accessToken);
    
    // Use a timeout to avoid the synchronous setState warning in effect
    setTimeout(() => {
      setSocket(newSocket);
    }, 0);

    newSocket.on('connect', () => {
      setStatus('connected');
    });

    newSocket.on('disconnect', () => {
      setStatus('disconnected');
    });

    newSocket.io.on('reconnect_attempt', () => {
      setStatus('reconnecting');
    });

    newSocket.connect();

    return () => {
      newSocket.disconnect();
      setTimeout(() => {
        setSocket(null);
        setStatus('disconnected');
      }, 0);
    };
  }, [isAuthenticated, accessToken, setStatus]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
