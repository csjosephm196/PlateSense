import { io } from 'socket.io-client';

export function createSocket(sessionId) {
  return io(window.location.origin, {
    query: { sessionId },
    path: '/socket.io',
  });
}
