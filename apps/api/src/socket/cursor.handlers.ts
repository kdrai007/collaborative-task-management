// =============================================================================
// socket/cursor.handlers.ts — Live cursor presence (fire-and-forget)
//
// cursor:move is not acknowledged — it is a high-frequency "presence" event.
// The server only relays it to other members in the workspace room.
// =============================================================================

import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from '@repo/types';

type IO  = Server<ClientToServerEvents, ServerToClientEvents, Record<string,never>, SocketData>;
type Soc = Socket<ClientToServerEvents, ServerToClientEvents, Record<string,never>, SocketData>;

export function registerCursorHandlers(io: IO, socket: Soc): void {

  socket.on('cursor:move', (payload) => {
    // Relay to everyone in the workspace room EXCEPT the sender.
    // The `socket.data.userId` is set by the auth middleware in socket/index.ts.
    socket.to(payload.workspaceId).emit('cursor:updated', {
      ...payload,
      userId: socket.data.userId,
    });
  });
}
