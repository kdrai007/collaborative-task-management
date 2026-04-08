// =============================================================================
// config.ts — Environment configuration
//
// All environment variables are read ONCE here and exported as a typed object.
// Nothing else in the codebase should access process.env directly.
// The .env file is managed by the developer — this file never touches it.
// =============================================================================

import 'dotenv/config'; // Load .env into process.env (no-op if not found)

export const config = {
  // --- Server ---
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',

  // --- Database ---
  // Default points to a local MongoDB instance — no Docker required.
  mongoUri: process.env['MONGO_URI'] ?? 'mongodb://localhost:27017/collab-tasks',

  // --- Redis ---
  // Default points to a local Redis instance on the standard port.
  redisUrl: process.env['REDIS_URL'] ?? 'redis://localhost:6379',

  // --- Auth ---
  jwtSecret: process.env['JWT_SECRET'] ?? 'dev-secret-CHANGE-in-production',
  cookieSecret: process.env['COOKIE_SECRET'] ?? 'dev-cookie-CHANGE-in-production',
  /** Salt rounds for bcrypt — 12 is secure; use 10 in test environments. */
  bcryptRounds: 12,

  // --- CORS ---
  // Vite dev server default. Override in production via CORS_ORIGIN env.
  corsOrigin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173',
} as const;
