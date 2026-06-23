'use client';

import { useSocket as useSocketFromProvider } from '@/providers/SocketProvider';

/**
 * Hook to access the Socket.IO client instance.
 * Must be used within SocketProvider.
 */
export function useSocket() {
  return useSocketFromProvider();
}
