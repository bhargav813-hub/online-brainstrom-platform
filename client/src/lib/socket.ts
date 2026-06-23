import { io, Socket } from 'socket.io-client';

export type AppSocket = Socket;

export function createSocket(token: string): AppSocket {
  return io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000', {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    autoConnect: false,
  });
}
