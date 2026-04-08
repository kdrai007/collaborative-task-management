// =============================================================================
// socket/column.handlers.ts — Real-time column reorder handler
// =============================================================================

import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, SocketData, Column } from '@repo/types';
import { ColumnModel } from '../models/Column.js';
import { midRank }     from '../lib/lexorank.js';

type IO  = Server<ClientToServerEvents, ServerToClientEvents, Record<string,never>, SocketData>;
type Soc = Socket<ClientToServerEvents, ServerToClientEvents, Record<string,never>, SocketData>;

export function registerColumnHandlers(io: IO, socket: Soc): void {

  // ---------------------------------------------------------------------------
  // column:reorder — recompute LexoRank for a column and broadcast
  // ---------------------------------------------------------------------------
  socket.on('column:reorder', async (payload, ack) => {
    try {
      const newOrder = midRank(payload.beforeOrder, payload.afterOrder);

      const column = await ColumnModel.findByIdAndUpdate(
        payload.columnId,
        { $set: { order: newOrder } },
        { returnDocument: 'after', runValidators: true },
      );

      if (!column) {
        ack({ success: false, message: 'Column not found' });
        return;
      }

      const columnJSON = column.toJSON() as unknown as Column;
      io.to(payload.workspaceId).emit('column:reordered', columnJSON);

      ack({ success: true, data: columnJSON });
    } catch (err) {
      ack({ success: false, message: (err as Error).message });
    }
  });
}
