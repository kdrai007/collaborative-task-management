// =============================================================================
// socket/index.ts — Socket.io server setup
//
// Attaches Socket.io to the Fastify HTTP server, wires the Redis adapter for
// horizontal scaling, authenticates every incoming connection, and registers
// all domain-level event handlers.
// =============================================================================

import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import type { FastifyInstance } from 'fastify';
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from '@repo/types';
import { pubClient, subClient } from '../lib/redis.js';
import { config } from '../config.js';
import { registerTaskHandlers }   from './task.handlers.js';
import { registerColumnHandlers } from './column.handlers.js';
import { registerCursorHandlers } from './cursor.handlers.js';

/**
 * Create and configure the Socket.io server.
 * Must be called AFTER `connectRedis()` so the pub/sub clients are ready.
 *
 * @param fastify - The Fastify instance, used to access the underlying HTTP server
 *                  and the JWT `verify` method.
 */
export function setupSocket(fastify: FastifyInstance): Server {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>(
    fastify.server,
    {
      // Allow the Vite dev server origin and send cookies cross-origin
      cors: {
        origin:      config.corsOrigin,
        credentials: true,
      },
    },
  );

  // Attach the Redis pub/sub adapter for multi-process / multi-server deployments.
  // pub pushes events; sub receives them and forwards to the correct room.
  io.adapter(createAdapter(pubClient, subClient));

  // ---------------------------------------------------------------------------
  // Authentication middleware — runs once per new socket connection.
  // Reads the JWT from socket.handshake.auth.token (set by the frontend client)
  // or falls back to the httpOnly cookie for same-origin browser connections.
  // ---------------------------------------------------------------------------
  io.use(async (socket, next) => {
    try {
      // Strategy 1: explicit token in the handshake (useful for mobile / Postman)
      let token: string | undefined = socket.handshake.auth['token'] as string | undefined;

      // Strategy 2: parse the httpOnly cookie automatically sent by the browser
      if (!token) {
        const cookieHeader = socket.handshake.headers['cookie'] ?? '';
        const match = /(?:^|;\s*)token=([^;]+)/.exec(cookieHeader);
        token = match?.[1];
      }

      if (!token) {
        next(new Error('Unauthorized: no token'));
        return;
      }

      // Verify using the same secret as the HTTP JWT plugin
      const decoded = fastify.jwt.verify<{ userId: string; email: string }>(token);

      // Attach the decoded user data to the socket for use in handlers
      socket.data.userId = decoded.userId;
      socket.data.email  = decoded.email;

      next();
    } catch {
      next(new Error('Unauthorized: invalid token'));
    }
  });

  // ---------------------------------------------------------------------------
  // Per-connection event registration
  // ---------------------------------------------------------------------------
  io.on('connection', (socket) => {
    console.log(`[Socket] connected: ${socket.data.userId} (${socket.id})`);

    // Join a workspace room — required before receiving workspace events
    socket.on('workspace:join', async (payload, ack) => {
      try {
        await socket.join(payload.workspaceId);
        ack({ success: true, data: undefined });
      } catch (err) {
        ack({ success: false, message: (err as Error).message });
      }
    });

    // Leave a workspace room
    socket.on('workspace:leave', async (payload, ack) => {
      try {
        await socket.leave(payload.workspaceId);
        ack({ success: true, data: undefined });
      } catch (err) {
        ack({ success: false, message: (err as Error).message });
      }
    });

    // Register domain handlers
    registerTaskHandlers(io, socket);
    registerColumnHandlers(io, socket);
    registerCursorHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(`[Socket] disconnected: ${socket.data.userId} — ${reason}`);
    });
  });

  return io;
}
