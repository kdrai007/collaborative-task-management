// =============================================================================
// lib/redis.ts — Redis client setup
//
// Socket.io's Redis adapter requires TWO separate client instances:
//   pubClient — used to publish events
//   subClient — used to subscribe (cannot share a connection used for pub)
// Both are created here and exported for use in socket/index.ts.
// =============================================================================

import { createClient, type RedisClientType } from 'redis';
import { config } from '../config.js';

// The primary publishing client
export const pubClient: RedisClientType = createClient({
  url: config.redisUrl,
}) as RedisClientType;

// A duplicate configured for subscribe mode.
// `duplicate()` shares the same config but creates an independent TCP connection.
export const subClient: RedisClientType = pubClient.duplicate() as RedisClientType;

/**
 * Connect both Redis clients concurrently.
 * Must be called before Socket.io's adapter is attached.
 */
export async function connectRedis(): Promise<void> {
  pubClient.on('error', (err) => console.error('[Redis] pub error:', err));
  subClient.on('error', (err) => console.error('[Redis] sub error:', err));

  await Promise.all([pubClient.connect(), subClient.connect()]);
  console.log('[Redis] Connected:', config.redisUrl);
}

/**
 * Gracefully disconnect both Redis clients.
 */
export async function disconnectRedis(): Promise<void> {
  await Promise.all([pubClient.quit(), subClient.quit()]);
  console.log('[Redis] Disconnected gracefully');
}
