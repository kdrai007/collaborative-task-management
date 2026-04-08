// =============================================================================
// controllers/auth.controller.ts — register, login, logout, me
//
// All handlers follow the contract: { success: true, data } | { success: false, message }
// JWT is issued as an httpOnly cookie — never returned in the response body.
// =============================================================================

import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { UserModel } from '../models/User.js';
import { config } from '../config.js';

// ---------------------------------------------------------------------------
// Zod schemas — validation happens BEFORE any DB operation
// ---------------------------------------------------------------------------

const registerSchema = z.object({
  name:     z.string().min(2).max(50),
  email:    z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

// ---------------------------------------------------------------------------
// Cookie helper — centralises httpOnly cookie options
// ---------------------------------------------------------------------------
function setAuthCookie(rep: FastifyReply, token: string): void {
  rep.setCookie('token', token, {
    httpOnly: true,                                         // not accessible via JS
    secure:   config.nodeEnv === 'production',             // HTTPS only in prod
    sameSite: 'strict',                                    // CSRF protection
    path:     '/',
    maxAge:   60 * 60 * 24 * 7,                           // 7 days in seconds
  });
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

/** POST /api/auth/register */
export async function register(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const body = registerSchema.parse(req.body);

  // Prevent duplicate accounts
  const existing = await UserModel.findOne({ email: body.email }).lean();
  if (existing) {
    await rep.status(409).send({ success: false, message: 'Email already in use' });
    return;
  }

  // Hash password before persisting
  const hash = await bcrypt.hash(body.password, config.bcryptRounds);
  const user  = await UserModel.create({ name: body.name, email: body.email, password: hash });

  // Sign token — payload is derived from the new user document
  const token = await rep.jwtSign({ userId: user.id as string, email: user.email });
  setAuthCookie(rep, token);

  await rep.status(201).send({ success: true, data: { user: user.toJSON() } });
}

/** POST /api/auth/login */
export async function login(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const body = loginSchema.parse(req.body);

  // Fetch user including the password hash (select: false not used, we strip in toJSON)
  const user = await UserModel.findOne({ email: body.email });
  if (!user) {
    // Return a generic message — do not reveal whether the email exists
    await rep.status(401).send({ success: false, message: 'Invalid credentials' });
    return;
  }

  const passwordMatch = await bcrypt.compare(body.password, user.password);
  if (!passwordMatch) {
    await rep.status(401).send({ success: false, message: 'Invalid credentials' });
    return;
  }

  const token = await rep.jwtSign({ userId: user.id as string, email: user.email });
  setAuthCookie(rep, token);

  await rep.status(200).send({ success: true, data: { user: user.toJSON() } });
}

/** POST /api/auth/logout */
export async function logout(_req: FastifyRequest, rep: FastifyReply): Promise<void> {
  // Clear the cookie by setting maxAge to 0
  rep.clearCookie('token', { path: '/' });
  await rep.status(200).send({ success: true, data: null });
}

/** GET /api/auth/me — protected by fastify.authenticate preHandler */
export async function me(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  // req.user is populated by jwtVerify() inside the authenticate preHandler
  const user = await UserModel.findById(req.user.userId).lean();
  if (!user) {
    await rep.status(404).send({ success: false, message: 'User not found' });
    return;
  }
  // Manually strip password since we used .lean() (toJSON transform not applied)
  const { password: _pw, ...safeUser } = user;
  await rep.send({ success: true, data: { user: { ...safeUser, id: user._id.toString() } } });
}
