// =============================================================================
// plugins/jwt.ts — JWT signing & verification via @fastify/jwt
//
// Configures @fastify/jwt to read its token from the 'token' httpOnly cookie.
// After registering this plugin, every route handler can call:
//   await request.jwtVerify() — to authenticate + decode
//   reply.jwtSign(payload)   — to issue a new token
// =============================================================================

import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import type { FastifyInstance } from 'fastify';
import { config } from '../config.js';

// ---------------------------------------------------------------------------
// Module augmentation — types the JWT payload so request.user is fully typed
// throughout the codebase without any 'as' casting.
// ---------------------------------------------------------------------------
declare module '@fastify/jwt' {
  interface FastifyJWT {
    /** Shape of the data we sign into each token. */
    payload: { userId: string; email: string };
    /** Shape of request.user after jwtVerify() decodes the token. */
    user: { userId: string; email: string };
  }
}

export const jwtPlugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(fastifyJwt, {
    secret: config.jwtSecret,
    // Tell @fastify/jwt where to find the token — the httpOnly cookie named 'token'.
    cookie: {
      cookieName: 'token',
      signed: false, // We are not using signed cookies for the JWT itself.
    },
  });
});
