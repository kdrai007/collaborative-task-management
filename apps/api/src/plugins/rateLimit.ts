// =============================================================================
// plugins/rateLimit.ts — Global rate limiting via @fastify/rate-limit
//
// Limits every IP to 100 requests per minute across all routes.
// Individual route groups (e.g. /auth) can override this with tighter limits.
// =============================================================================

import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';

export const rateLimitPlugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(rateLimit, {
    global: true,
    max: 100,               // requests per window
    timeWindow: '1 minute', // rolling window
    errorResponseBuilder: (_req, context) => ({
      success: false,
      message: `Too many requests. Try again in ${context.after}.`,
    }),
  });
});
