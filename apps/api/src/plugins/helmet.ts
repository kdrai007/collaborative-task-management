// =============================================================================
// plugins/helmet.ts — Security headers via @fastify/helmet
//
// Helmet sets HTTP headers that protect against common web vulnerabilities:
// XSS, clickjacking, MIME sniffing, etc.
// =============================================================================

import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';
import type { FastifyInstance } from 'fastify';

/**
 * Wrapping with fastify-plugin (fp) ensures the decorations and hooks
 * added by this plugin are available in the parent scope (not scoped).
 */
export const helmetPlugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(helmet, {
    // Allow the frontend to load from the same origin in development.
    contentSecurityPolicy: false,
  });
});
