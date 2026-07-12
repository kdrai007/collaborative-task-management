// =============================================================================
// routes/auth.routes.ts
// =============================================================================

import type { FastifyInstance } from 'fastify';
import { register, login, logout, me } from '../controllers/auth.controller.js';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  // Tighter rate limit for auth endpoints to prevent brute-force
  const authRateLimit = { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } };

  fastify.post('/register', authRateLimit, register);
  fastify.post('/login', authRateLimit, login);
  fastify.post('/logout', { preHandler: [fastify.authenticate] }, logout);

  // Protected — must be logged in to get own user info
  fastify.get('/me', { preHandler: [fastify.authenticate] }, me);
}
