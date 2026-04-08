// =============================================================================
// plugins/cors.ts — Cross-Origin Resource Sharing via @fastify/cors
//
// credentials: true is required so the browser sends the httpOnly JWT cookie
// with cross-origin requests from the Vite dev server.
// =============================================================================

import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import { config } from '../config.js';

export const corsPlugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(cors, {
    // Single origin from env — expand to an array for multi-origin support.
    origin: config.corsOrigin,
    // Must be true for cookies to be sent cross-origin.
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
});
