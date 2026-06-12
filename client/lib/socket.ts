import { io, Socket } from 'socket.io-client';
import { env } from '@/config/env';
import type { ServerToClientEvents, ClientToServerEvents } from '@/types/socket';

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

export function getSocket(): AppSocket | null {
  return socket;
}

export function createSocket(token: string): AppSocket {
  if (socket?.connected) {
    socket.disconnect();
  }

  socket = io(env.NEXT_PUBLIC_SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
