import { Server } from 'socket.io';
import Session from '../models/Session.js';

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
  });

  io.on('connection', async (socket) => {
    const sessionId = socket.handshake.query.sessionId;
    if (sessionId) {
      const session = await Session.findOne({ sessionId });
      if (session && session.expiresAt > new Date()) {
        socket.join(sessionId);
      }
    }
  });
}

export function getIo() {
  return io;
}
