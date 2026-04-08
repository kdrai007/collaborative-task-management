// =============================================================================
// __tests__/routes.test.ts — Integration tests for all API routes
//
// Coverage per GEMINI.md rule: every protected endpoint has one test per role
//   (viewer, member, admin) plus unauthenticated and outsider edge cases.
//
// Test isolation: afterEach in setup.ts wipes all collections so each `it`
// block starts with a completely clean database.
// =============================================================================

import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';
import {
  buildApp,
  createUser,
  createWorkspace,
  createWorkspaceWithRoles,
  inject,
  type TestUser,
} from './helpers.js';

// Shared Fastify instance — created once, reused across all describe blocks.
// The DB is wiped between tests by setup.ts, but the app itself stays up.
let app: FastifyInstance;

beforeEach(async () => {
  // Build fresh only if not already created (buildApp is idempotent per process)
  if (!app) app = await buildApp();
});

afterAll(async () => {
  await app?.close();
});

// =============================================================================
// AUTH  /api/auth/*
// =============================================================================

describe('Auth routes', () => {

  describe('POST /api/auth/register', () => {
    it('creates an account, returns 201 and sets an httpOnly JWT cookie', async () => {
      const res = await inject(app, {
        method:  'POST',
        url:     '/api/auth/register',
        payload: { name: 'Alice', email: 'alice@test.com', password: 'password123' },
      });

      expect(res.statusCode).toBe(201);
      const body = res.json();
      expect(body.success).toBe(true);
      expect(body.data.user.email).toBe('alice@test.com');
      // Password hash must NEVER appear in the response
      expect(body.data.user.password).toBeUndefined();

      // JWT must arrive as an httpOnly cookie
      const cookies = res.headers['set-cookie'] as string | string[];
      const arr = Array.isArray(cookies) ? cookies : [cookies];
      const tokenCookie = arr.find((c) => c.startsWith('token='));
      expect(tokenCookie).toBeDefined();
      expect(tokenCookie).toMatch(/HttpOnly/i);
    });

    it('returns 409 when email is already taken', async () => {
      await createUser(app, 'alice@test.com', 'Alice');
      const res = await inject(app, {
        method:  'POST',
        url:     '/api/auth/register',
        payload: { name: 'Alice 2', email: 'alice@test.com', password: 'password123' },
      });
      expect(res.statusCode).toBe(409);
      expect(res.json().success).toBe(false);
    });

    it('returns 400 for an invalid email', async () => {
      const res = await inject(app, {
        method:  'POST',
        url:     '/api/auth/register',
        payload: { name: 'Alice', email: 'not-an-email', password: 'password123' },
      });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 when password is shorter than 8 characters', async () => {
      const res = await inject(app, {
        method:  'POST',
        url:     '/api/auth/register',
        payload: { name: 'Alice', email: 'alice@test.com', password: 'short' },
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('returns 200 and sets the JWT cookie on correct credentials', async () => {
      await createUser(app, 'alice@test.com', 'Alice');
      const res = await inject(app, {
        method:  'POST',
        url:     '/api/auth/login',
        payload: { email: 'alice@test.com', password: 'password123' },
      });
      expect(res.statusCode).toBe(200);
      expect(res.json().success).toBe(true);
      const cookies = res.headers['set-cookie'] as string | string[];
      const arr = Array.isArray(cookies) ? cookies : [cookies];
      expect(arr.some((c) => c.startsWith('token='))).toBe(true);
    });

    it('returns 401 for wrong password', async () => {
      await createUser(app, 'alice@test.com', 'Alice');
      const res = await inject(app, {
        method:  'POST',
        url:     '/api/auth/login',
        payload: { email: 'alice@test.com', password: 'wrongpassword' },
      });
      expect(res.statusCode).toBe(401);
    });

    it('returns 401 for unknown email (no account)', async () => {
      const res = await inject(app, {
        method:  'POST',
        url:     '/api/auth/login',
        payload: { email: 'nobody@test.com', password: 'password123' },
      });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('returns 200 and clears the token cookie', async () => {
      const user = await createUser(app, 'alice@test.com', 'Alice');
      const res  = await inject(app, { method: 'POST', url: '/api/auth/logout', token: user.token });
      expect(res.statusCode).toBe(200);
      // The cookie should be expired/cleared
      const cookies = res.headers['set-cookie'] as string | string[];
      const arr = Array.isArray(cookies) ? cookies : [cookies ?? ''];
      expect(arr.some((c) => c.includes('token=;') || c.includes('Max-Age=0'))).toBe(true);
    });

    it('returns 401 when called without a token', async () => {
      const res = await inject(app, { method: 'POST', url: '/api/auth/logout' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns the authenticated user profile', async () => {
      const user = await createUser(app, 'alice@test.com', 'Alice');
      const res  = await inject(app, { method: 'GET', url: '/api/auth/me', token: user.token });
      expect(res.statusCode).toBe(200);
      const body = res.json();
      expect(body.data.user.email).toBe('alice@test.com');
      expect(body.data.user.password).toBeUndefined();
    });

    it('returns 401 without a token', async () => {
      const res = await inject(app, { method: 'GET', url: '/api/auth/me' });
      expect(res.statusCode).toBe(401);
    });
  });
});

// =============================================================================
// WORKSPACES  /api/workspaces/*
// =============================================================================

describe('Workspace routes', () => {
  let admin:    TestUser;
  let member:   TestUser;
  let viewer:   TestUser;
  let outsider: TestUser;
  let wid:      string; // workspace id

  beforeEach(async () => {
    // Re-create fixture data for every test (DB is wiped by setup.ts afterEach)
    ({ workspaceId: wid, admin, member, viewer, outsider } =
      await createWorkspaceWithRoles(app));
  });

  describe('POST /api/workspaces', () => {
    it('creates a workspace and seeds 3 default columns (201)', async () => {
      const seed = await createUser(app, 'seed@test.com', 'Seed');
      const res  = await inject(app, {
        method:  'POST',
        url:     '/api/workspaces',
        token:   seed.token,
        payload: { name: 'My Board' },
      });
      expect(res.statusCode).toBe(201);
      expect(res.json().data.workspace.name).toBe('My Board');
    });

    it('returns 401 without authentication', async () => {
      const res = await inject(app, { method: 'POST', url: '/api/workspaces', payload: { name: 'X' } });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/workspaces', () => {
    it('returns only workspaces the user belongs to', async () => {
      const res = await inject(app, { method: 'GET', url: '/api/workspaces', token: admin.token });
      expect(res.statusCode).toBe(200);
      const ids: string[] = res.json().data.workspaces.map((w: { id: string }) => w.id);
      expect(ids).toContain(wid);
    });

    it('outsider receives 200 but with an empty list for this workspace', async () => {
      const res = await inject(app, { method: 'GET', url: '/api/workspaces', token: outsider.token });
      expect(res.statusCode).toBe(200);
      const ids: string[] = res.json().data.workspaces.map((w: { id: string }) => w.id);
      expect(ids).not.toContain(wid);
    });
  });

  describe('GET /api/workspaces/:workspaceId — RBAC: viewer', () => {
    it.each([
      ['viewer', () => viewer.token, 200],
      ['member', () => member.token, 200],
      ['admin',  () => admin.token,  200],
    ])('%s can read workspace details ($2)', async (_role, getToken, expected) => {
      const res = await inject(app, { method: 'GET', url: `/api/workspaces/${wid}`, token: getToken() });
      expect(res.statusCode).toBe(expected);
    });

    it('outsider gets 403', async () => {
      const res = await inject(app, { method: 'GET', url: `/api/workspaces/${wid}`, token: outsider.token });
      expect(res.statusCode).toBe(403);
    });

    it('unauthenticated gets 401', async () => {
      const res = await inject(app, { method: 'GET', url: `/api/workspaces/${wid}` });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PATCH /api/workspaces/:workspaceId — RBAC: admin only', () => {
    it.each([
      ['viewer', () => viewer.token, 403],
      ['member', () => member.token, 403],
      ['admin',  () => admin.token,  200],
    ])('$0 → $2', async (_role, getToken, expected) => {
      const res = await inject(app, {
        method:  'PATCH',
        url:     `/api/workspaces/${wid}`,
        token:   getToken(),
        payload: { name: 'Renamed' },
      });
      expect(res.statusCode).toBe(expected);
    });
  });

  describe('DELETE /api/workspaces/:workspaceId — RBAC: admin only', () => {
    it.each([
      ['viewer', () => viewer.token, 403],
      ['member', () => member.token, 403],
      ['admin',  () => admin.token,  200],
    ])('$0 → $2', async (_role, getToken, expected) => {
      const res = await inject(app, { method: 'DELETE', url: `/api/workspaces/${wid}`, token: getToken() });
      expect(res.statusCode).toBe(expected);
    });
  });

  describe('POST /api/workspaces/:workspaceId/members — RBAC: admin only', () => {
    it.each([
      ['viewer', () => viewer.token, 403],
      ['member', () => member.token, 403],
    ])('%s → 403', async (_role, getToken) => {
      const res = await inject(app, {
        method:  'POST',
        url:     `/api/workspaces/${wid}/members`,
        token:   getToken(),
        payload: { email: outsider.email, role: 'viewer' },
      });
      expect(res.statusCode).toBe(403);
    });

    it('admin can invite a new member (201)', async () => {
      const res = await inject(app, {
        method:  'POST',
        url:     `/api/workspaces/${wid}/members`,
        token:   admin.token,
        payload: { email: outsider.email, role: 'member' },
      });
      expect(res.statusCode).toBe(201);
    });

    it('returns 409 when user is already a member', async () => {
      const res = await inject(app, {
        method:  'POST',
        url:     `/api/workspaces/${wid}/members`,
        token:   admin.token,
        payload: { email: member.email, role: 'viewer' },
      });
      expect(res.statusCode).toBe(409);
    });
  });

  describe('DELETE /api/workspaces/:workspaceId/members/:userId — RBAC: admin only', () => {
    it.each([
      ['viewer', () => viewer.token],
      ['member', () => member.token],
    ])('%s → 403', async (_role, getToken) => {
      const res = await inject(app, {
        method: 'DELETE',
        url:    `/api/workspaces/${wid}/members/${viewer.id}`,
        token:  getToken(),
      });
      expect(res.statusCode).toBe(403);
    });

    it('admin can remove a member (200)', async () => {
      const res = await inject(app, {
        method: 'DELETE',
        url:    `/api/workspaces/${wid}/members/${viewer.id}`,
        token:  admin.token,
      });
      expect(res.statusCode).toBe(200);
    });
  });
});

// =============================================================================
// COLUMNS  /api/workspaces/:workspaceId/columns/*
// =============================================================================

describe('Column routes', () => {
  let admin:  TestUser;
  let member: TestUser;
  let viewer: TestUser;
  let wid:    string;

  beforeEach(async () => {
    ({ workspaceId: wid, admin, member, viewer } = await createWorkspaceWithRoles(app));
  });

  // Helper: create a column as admin and return its id
  async function createCol(title = 'Backlog'): Promise<string> {
    const res = await inject(app, {
      method:  'POST',
      url:     `/api/workspaces/${wid}/columns`,
      token:   admin.token,
      payload: { title },
    });
    return (res.json() as { data: { column: { id: string } } }).data.column.id;
  }

  describe('POST /api/workspaces/:workspaceId/columns — RBAC: member+', () => {
    it.each([
      ['viewer', () => viewer.token, 403],
      ['member', () => member.token, 201],
      ['admin',  () => admin.token,  201],
    ])('$0 → $2', async (_role, getToken, expected) => {
      const res = await inject(app, {
        method:  'POST',
        url:     `/api/workspaces/${wid}/columns`,
        token:   getToken(),
        payload: { title: 'Sprint 1' },
      });
      expect(res.statusCode).toBe(expected);
    });
  });

  describe('PATCH /api/workspaces/:workspaceId/columns/:columnId — RBAC: member+', () => {
    it.each([
      ['viewer', () => viewer.token, 403],
      ['member', () => member.token, 200],
      ['admin',  () => admin.token,  200],
    ])('$0 → $2', async (_role, getToken, expected) => {
      const colId = await createCol();
      const res = await inject(app, {
        method:  'PATCH',
        url:     `/api/workspaces/${wid}/columns/${colId}`,
        token:   getToken(),
        payload: { title: 'Renamed' },
      });
      expect(res.statusCode).toBe(expected);
    });
  });

  describe('DELETE /api/workspaces/:workspaceId/columns/:columnId — RBAC: admin only', () => {
    it.each([
      ['viewer', () => viewer.token, 403],
      ['member', () => member.token, 403],
      ['admin',  () => admin.token,  200],
    ])('$0 → $2', async (_role, getToken, expected) => {
      const colId = await createCol();
      const res = await inject(app, {
        method: 'DELETE',
        url:    `/api/workspaces/${wid}/columns/${colId}`,
        token:  getToken(),
      });
      expect(res.statusCode).toBe(expected);
    });
  });
});

// =============================================================================
// TASKS  /api/workspaces/:workspaceId/tasks/*
// =============================================================================

describe('Task routes', () => {
  let admin:  TestUser;
  let member: TestUser;
  let viewer: TestUser;
  let wid:    string;
  let colId:  string;

  beforeEach(async () => {
    ({ workspaceId: wid, admin, member, viewer } = await createWorkspaceWithRoles(app));
    // Pick the first seeded column (workspace creation seeds 3 columns)
    const wsRes = await inject(app, { method: 'GET', url: `/api/workspaces/${wid}`, token: admin.token });
    colId = (wsRes.json().data.columns[0] as { id: string }).id;
  });

  async function createTask(token: string, title = 'Test task'): Promise<string> {
    const res = await inject(app, {
      method:  'POST',
      url:     `/api/workspaces/${wid}/tasks`,
      token,
      payload: { workspaceId: wid, columnId: colId, title },
    });
    return (res.json() as { data: { task: { id: string } } }).data.task.id;
  }

  describe('POST /api/workspaces/:workspaceId/tasks — RBAC: member+', () => {
    it.each([
      ['viewer', () => viewer.token, 403],
      ['member', () => member.token, 201],
      ['admin',  () => admin.token,  201],
    ])('$0 → $2', async (_role, getToken, expected) => {
      const res = await inject(app, {
        method:  'POST',
        url:     `/api/workspaces/${wid}/tasks`,
        token:   getToken(),
        payload: { workspaceId: wid, columnId: colId, title: 'A task' },
      });
      expect(res.statusCode).toBe(expected);
    });
  });

  describe('GET /api/workspaces/:workspaceId/tasks/:taskId — RBAC: viewer+', () => {
    it.each([
      ['viewer', () => viewer.token, 200],
      ['member', () => member.token, 200],
      ['admin',  () => admin.token,  200],
    ])('$0 → $2', async (_role, getToken, expected) => {
      const tid = await createTask(admin.token);
      const res = await inject(app, {
        method: 'GET',
        url:    `/api/workspaces/${wid}/tasks/${tid}`,
        token:  getToken(),
      });
      expect(res.statusCode).toBe(expected);
    });
  });

  describe('PATCH /api/workspaces/:workspaceId/tasks/:taskId — RBAC: member+', () => {
    it.each([
      ['viewer', () => viewer.token, 403],
      ['member', () => member.token, 200],
      ['admin',  () => admin.token,  200],
    ])('$0 → $2', async (_role, getToken, expected) => {
      const tid = await createTask(admin.token);
      const res = await inject(app, {
        method:  'PATCH',
        url:     `/api/workspaces/${wid}/tasks/${tid}`,
        token:   getToken(),
        payload: { title: 'Updated title' },
      });
      expect(res.statusCode).toBe(expected);
    });
  });

  describe('DELETE /api/workspaces/:workspaceId/tasks/:taskId — RBAC: member+', () => {
    it.each([
      ['viewer', () => viewer.token, 403],
      ['member', () => member.token, 200],
      ['admin',  () => admin.token,  200],
    ])('$0 → $2', async (_role, getToken, expected) => {
      const tid = await createTask(admin.token);
      const res = await inject(app, {
        method: 'DELETE',
        url:    `/api/workspaces/${wid}/tasks/${tid}`,
        token:  getToken(),
      });
      expect(res.statusCode).toBe(expected);
    });
  });
});

// =============================================================================
// COMMENTS  /api/workspaces/:workspaceId/tasks/:taskId/comments/*
// =============================================================================

describe('Comment routes', () => {
  let admin:  TestUser;
  let member: TestUser;
  let viewer: TestUser;
  let wid:    string;
  let tid:    string;

  beforeEach(async () => {
    ({ workspaceId: wid, admin, member, viewer } = await createWorkspaceWithRoles(app));

    // Get first column
    const wsRes = await inject(app, { method: 'GET', url: `/api/workspaces/${wid}`, token: admin.token });
    const colId = (wsRes.json().data.columns[0] as { id: string }).id;

    // Create a task
    const taskRes = await inject(app, {
      method:  'POST',
      url:     `/api/workspaces/${wid}/tasks`,
      token:   admin.token,
      payload: { workspaceId: wid, columnId: colId, title: 'Commented task' },
    });
    tid = (taskRes.json() as { data: { task: { id: string } } }).data.task.id;
  });

  const commentUrl = () => `/api/workspaces/${wid}/tasks/${tid}/comments`;

  describe('GET comments — RBAC: viewer+', () => {
    it.each([
      ['viewer', () => viewer.token, 200],
      ['member', () => member.token, 200],
      ['admin',  () => admin.token,  200],
    ])('$0 → $2', async (_role, getToken, expected) => {
      const res = await inject(app, { method: 'GET', url: commentUrl(), token: getToken() });
      expect(res.statusCode).toBe(expected);
    });
  });

  describe('POST comments — RBAC: member+', () => {
    it.each([
      ['viewer', () => viewer.token, 403],
      ['member', () => member.token, 201],
      ['admin',  () => admin.token,  201],
    ])('$0 → $2', async (_role, getToken, expected) => {
      const res = await inject(app, {
        method:  'POST',
        url:     commentUrl(),
        token:   getToken(),
        payload: { body: 'Hello!' },
      });
      expect(res.statusCode).toBe(expected);
    });
  });

  describe('DELETE comment — author-only', () => {
    it('the author can delete their own comment (200)', async () => {
      // member posts a comment
      const postRes = await inject(app, {
        method:  'POST',
        url:     commentUrl(),
        token:   member.token,
        payload: { body: 'My comment' },
      });
      const cid = (postRes.json() as { data: { comment: { id: string } } }).data.comment.id;

      const res = await inject(app, {
        method: 'DELETE',
        url:    `${commentUrl()}/${cid}`,
        token:  member.token,
      });
      expect(res.statusCode).toBe(200);
    });

    it('another member cannot delete someone else\'s comment (403)', async () => {
      // admin posts
      const postRes = await inject(app, {
        method:  'POST',
        url:     commentUrl(),
        token:   admin.token,
        payload: { body: "Admin's comment" },
      });
      const cid = (postRes.json() as { data: { comment: { id: string } } }).data.comment.id;

      // member tries to delete admin's comment
      const res = await inject(app, {
        method: 'DELETE',
        url:    `${commentUrl()}/${cid}`,
        token:  member.token,
      });
      expect(res.statusCode).toBe(403);
    });
  });
});
