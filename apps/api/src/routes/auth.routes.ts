// =============================================================================
// routes/auth.routes.ts
// =============================================================================

import type { FastifyInstance } from 'fastify';
import { register, login, logout, me } from '../controllers/auth.controller.js';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  // Tighter rate limit for auth endpoints to prevent brute-force
  const authRateLimit = { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } };

  fastify.post('/register', authRateLimit, register);
  fastify.post('/login',    authRateLimit, login);

  // Protected — must be logged in to log out / get self
  fastify.post('/logout', { preHandler: [fastify.authenticate] }, logout);
  fastify.get('/me',      { preHandler: [fastify.authenticate] }, me);
}
