// =============================================================================
// lib/db.ts — Mongoose connection lifecycle
// =============================================================================

import mongoose from 'mongoose';
import { config } from '../config.js';

/**
 * Open a connection to MongoDB.
 * Called once at server startup — Mongoose manages the connection pool internally.
 */
export async function connectDB(): Promise<void> {
  // Mongoose emits events we can log for observability.
  mongoose.connection.on('connected', () =>
    console.log('[DB] MongoDB connected:', config.mongoUri),
  );
  mongoose.connection.on('error', (err) =>
    console.error('[DB] MongoDB connection error:', err),
  );
  mongoose.connection.on('disconnected', () =>
    console.warn('[DB] MongoDB disconnected'),
  );

  await mongoose.connect(config.mongoUri);
}

/**
 * Gracefully close the Mongoose connection.
 * Called during SIGTERM / SIGINT to allow in-flight queries to finish.
 */
export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('[DB] MongoDB disconnected gracefully');
}
