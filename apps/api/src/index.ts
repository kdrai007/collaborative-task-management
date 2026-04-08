// =============================================================================
// src/index.ts — Fastify application bootstrap
//
// Plugin registration ORDER is an architectural invariant (see GEMINI.md).
// DO NOT reorder the plugin registrations below without explicit approval.
//
//   helmet → cors → cookie → jwt → rate-limit → auth-decorator → routes → socket
// =============================================================================

import Fastify from 'fastify';
import { ZodError } from 'zod';
import { config } from './config.js';
import { connectDB, disconnectDB } from './lib/db.js';
import { connectRedis, disconnectRedis } from './lib/redis.js';

// --- Plugins (registration order is fixed) ---
import { helmetPlugin } from './plugins/helmet.js';
import { corsPlugin } from './plugins/cors.js';
import { cookiePlugin } from './plugins/cookie.js';
import { jwtPlugin } from './plugins/jwt.js';
import { rateLimitPlugin } from './plugins/rateLimit.js';
import { authPlugin } from './plugins/auth.js';

// --- Routes ---
import { registerRoutes } from './routes/index.js';

// --- Socket.io ---
import { setupSocket } from './socket/index.js';

async function bootstrap(): Promise<void> {
  // -------------------------------------------------------------------------
  // 1. Create the Fastify instance with structured JSON logging
  // -------------------------------------------------------------------------
  const fastify = Fastify({
    logger: {
      level: config.nodeEnv === 'production' ? 'warn' : 'info',
    },
  });

  // -------------------------------------------------------------------------
  // 2. Global error handler
  //    Converts ZodError (validation failures) to a consistent 400 response.
  //    All other errors fall back to Fastify's default handler (500).
  // -------------------------------------------------------------------------
  fastify.setErrorHandler(async (error, _req, rep) => {
    if (error instanceof ZodError) {
      // Zod v4 exposes validation failures as `issues` (not `errors`)
      const first = error.issues[0];
      await rep.status(400).send({
        success: false,
        message: first ? `${first.path.join('.')}: ${first.message}` : 'Validation error',
      });
      return;
    }

    // Surface the status code if the plugin/handler set one (e.g. rate-limit → 429)
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500;
    const message = (error as { message?: string }).message ?? 'Internal server error';
    await rep.status(statusCode).send({ success: false, message });
  });

  // -------------------------------------------------------------------------
  // 3. Register plugins in the FIXED order defined in GEMINI.md
  // -------------------------------------------------------------------------
  await fastify.register(helmetPlugin);    // ① security headers
  await fastify.register(corsPlugin);      // ② CORS + credentials
  await fastify.register(cookiePlugin);    // ③ cookie parser (must precede jwt)
  await fastify.register(jwtPlugin);       // ④ JWT sign/verify + cookie binding
  await fastify.register(rateLimitPlugin); // ⑤ global rate limiting
  await fastify.register(authPlugin);      // ⑥ fastify.authenticate decorator

  // -------------------------------------------------------------------------
  // 4. Register all REST routes under /api
  // -------------------------------------------------------------------------
  await fastify.register(registerRoutes, { prefix: '/api' });

  // -------------------------------------------------------------------------
  // 5. Connect to external services (DB + Redis) before accepting traffic
  // -------------------------------------------------------------------------
  await connectDB();
  await connectRedis();

  // -------------------------------------------------------------------------
  // 6. Attach Socket.io AFTER Redis is connected (adapter needs pub/sub)
  // -------------------------------------------------------------------------
  setupSocket(fastify);

  // -------------------------------------------------------------------------
  // 7. Start listening
  // -------------------------------------------------------------------------
  await fastify.listen({ port: config.port, host: '0.0.0.0' });
  console.log(`[Server] Listening on http://0.0.0.0:${config.port}`);

  // -------------------------------------------------------------------------
  // 8. Graceful shutdown — close DB and Redis before exiting
  // -------------------------------------------------------------------------
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`[Server] ${signal} received — shutting down gracefully`);
    await fastify.close();
    await disconnectDB();
    await disconnectRedis();
    process.exit(0);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

// Start the application
bootstrap().catch((err: unknown) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
