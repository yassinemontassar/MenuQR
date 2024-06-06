// socket.service.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket

export async function connectSocket(): Promise<Socket> {
  if (!socket) {
    socket = io("http://51.91.10.161/");
    await new Promise<void>((resolve) => {
      socket.on('connect', () => resolve());
    });
  }
  return socket;
}

export async function emitNotification(title: string, message: string): Promise<void> {
  const socket = await connectSocket();
  socket.emit('notification', { title, message });
}

// Optionally, you can add methods for handling event listeners or disconnecting the socket
