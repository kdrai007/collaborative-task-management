// =============================================================================
// __tests__/helpers.ts — Shared test utilities
//
// buildApp()        — creates a Fastify instance wired with all plugins + routes
//                     (rate limiting excluded to avoid hitting limits in tests)
// createUser()      — registers a user and returns { id, email, token }
// createWorkspace() — creates a workspace and returns its id
// createWorkspaceWithRoles() — creates admin/member/viewer/outsider fixture
// inject()          — thin wrapper around fastify.inject with cookie support
// =============================================================================

import Fastify, { type FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { helmetPlugin }    from '../plugins/helmet.js';
import { corsPlugin }      from '../plugins/cors.js';
import { cookiePlugin }    from '../plugins/cookie.js';
import { jwtPlugin }       from '../plugins/jwt.js';
import { authPlugin }      from '../plugins/auth.js';
import { registerRoutes }  from '../routes/index.js';

// ---------------------------------------------------------------------------
// App factory
// ---------------------------------------------------------------------------

/**
 * Build a fully-wired Fastify app suitable for route integration tests.
 * Rate limiting is intentionally omitted so rapid test requests don't get blocked.
 */
export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: false });

  // Mirror the production error handler from src/index.ts
  app.setErrorHandler(async (error, _req, rep) => {
    if (error instanceof ZodError) {
      const first = error.issues[0];
      await rep.status(400).send({
        success: false,
        message: first ? `${first.path.join('.')}: ${first.message}` : 'Validation error',
      });
      return;
    }
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500;
    const message    = (error as { message?: string }).message ?? 'Internal server error';
    await rep.status(statusCode).send({ success: false, message });
  });

  // Plugin order mirrors GEMINI.md invariant (rate-limit excluded for tests)
  await app.register(helmetPlugin);
  await app.register(corsPlugin);
  await app.register(cookiePlugin);
  await app.register(jwtPlugin);
  await app.register(authPlugin);
  await app.register(registerRoutes, { prefix: '/api' });

  await app.ready();
  return app;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TestUser {
  id:    string;
  email: string;
  /** Raw JWT extracted from the set-cookie header — use as cookie: `token=${token}` */
  token: string;
}

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

/** Extract the raw JWT value from a set-cookie response header. */
function extractToken(header: string | string[] | undefined): string {
  if (!header) throw new Error('No set-cookie header in response');
  const cookies = Array.isArray(header) ? header : [header];
  for (const c of cookies) {
    const m = /^token=([^;]+)/.exec(c);
    if (m?.[1]) return m[1];
  }
  throw new Error('token cookie not found in set-cookie headers');
}

/** Register a new user and return their id, email, and JWT. */
export async function createUser(
  app: FastifyInstance,
  email:    string,
  name:     string,
  password = 'password123',
): Promise<TestUser> {
  const res = await app.inject({
    method:  'POST',
    url:     '/api/auth/register',
    payload: { name, email, password },
  });
  if (res.statusCode !== 201) {
    throw new Error(`createUser failed (${res.statusCode}): ${res.body}`);
  }
  const body = res.json() as { data: { user: { id: string } } };
  return { id: body.data.user.id, email, token: extractToken(res.headers['set-cookie']) };
}

/** Create a workspace owned by `token` and return its id. */
export async function createWorkspace(
  app:   FastifyInstance,
  token: string,
  name = 'Test Workspace',
): Promise<string> {
  const res = await app.inject({
    method:  'POST',
    url:     '/api/workspaces',
    headers: { cookie: `token=${token}` },
    payload: { name },
  });
  if (res.statusCode !== 201) {
    throw new Error(`createWorkspace failed (${res.statusCode}): ${res.body}`);
  }
  return (res.json() as { data: { workspace: { id: string } } }).data.workspace.id;
}

/**
 * Create a workspace with four actors:
 *   admin    — owns the workspace
 *   member   — invited as 'member'
 *   viewer   — invited as 'viewer'
 *   outsider — registered but NOT in the workspace
 */
export async function createWorkspaceWithRoles(app: FastifyInstance) {
  const seed = Math.random().toString(36).slice(2, 7);
  const admin    = await createUser(app, `admin-${seed}@t.com`,    'Admin');
  const member   = await createUser(app, `member-${seed}@t.com`,   'Member');
  const viewer   = await createUser(app, `viewer-${seed}@t.com`,   'Viewer');
  const outsider = await createUser(app, `outsider-${seed}@t.com`, 'Outsider');

  const workspaceId = await createWorkspace(app, admin.token);

  // Invite member
  await app.inject({
    method:  'POST',
    url:     `/api/workspaces/${workspaceId}/members`,
    headers: { cookie: `token=${admin.token}` },
    payload: { email: member.email, role: 'member' },
  });
  // Invite viewer
  await app.inject({
    method:  'POST',
    url:     `/api/workspaces/${workspaceId}/members`,
    headers: { cookie: `token=${admin.token}` },
    payload: { email: viewer.email, role: 'viewer' },
  });

  return { workspaceId, admin, member, viewer, outsider };
}

/** Convenience wrapper around fastify.inject with optional auth cookie. */
export function inject(
  app:  FastifyInstance,
  opts: {
    method:   'GET' | 'POST' | 'PATCH' | 'DELETE';
    url:      string;
    token?:   string;
    payload?: Record<string, unknown>;
  },
) {
  return app.inject({
    method:  opts.method,
    url:     opts.url,
    headers: opts.token ? { cookie: `token=${opts.token}` } : undefined,
    payload: opts.payload,
  });
}
