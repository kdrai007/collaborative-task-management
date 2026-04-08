// =============================================================================
// plugins/cookie.ts — Cookie parser via @fastify/cookie
//
// Must be registered BEFORE @fastify/jwt so JWT can read the token cookie.
// =============================================================================

import fp from 'fastify-plugin';
import cookie from '@fastify/cookie';
import type { FastifyInstance } from 'fastify';
import { config } from '../config.js';

export const cookiePlugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(cookie, {
    secret: config.cookieSecret, // used for signed cookies (optional but good practice)
    hook: 'onRequest',           // parse cookies on every request
  });
});
