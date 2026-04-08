// =============================================================================
// plugins/auth.ts — Authentication decorator
//
// Decorates the Fastify instance with `fastify.authenticate` — a preHandler
// that protects routes by verifying the JWT cookie.
//
// Usage in a route:
//   fastify.get('/me', { preHandler: [fastify.authenticate] }, handler)
//
// After authenticate runs, handler can safely access request.user.userId.
// =============================================================================

import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

// ---------------------------------------------------------------------------
// Extend the FastifyInstance type so TypeScript knows about our custom decorator.
// ---------------------------------------------------------------------------
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, rep: FastifyReply) => Promise<void>;
  }
}

export const authPlugin = fp(async (fastify: FastifyInstance) => {
  /**
   * Verify the JWT in the 'token' cookie.
   * On success:  request.user is populated with { userId, email }.
   * On failure:  sends 401 Unauthorized immediately, stopping the handler chain.
   */
  fastify.decorate(
    'authenticate',
    async (req: FastifyRequest, rep: FastifyReply): Promise<void> => {
      try {
        // jwtVerify reads the cookie (configured in plugins/jwt.ts),
        // verifies the signature, and attaches the decoded payload to req.user.
        await req.jwtVerify();
      } catch {
        await rep.status(401).send({ success: false, message: 'Unauthorized' });
      }
    },
  );
});
