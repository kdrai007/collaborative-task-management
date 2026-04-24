import { createElement, lazy } from 'react';
import { redirect } from 'react-router';
import { queryClient } from './lib/queryClient';
import { authApi } from './lib/api';
import { RootLayout, RouteError } from './layouts/RootLayout';
import type { RouteMeta } from './types/route';

// ---------------------------------------------------------------------------
// Lazy-loaded page components — each route gets its own JS chunk
// ---------------------------------------------------------------------------
const Landing = lazy(() => import('./pages/Landing').then((m) => ({ default: m.Landing })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Signup = lazy(() => import('./pages/Signup').then((m) => ({ default: m.Signup })));
const DashboardLayout = lazy(() =>
  import('./layouts/DashboardLayout').then((m) => ({ default: m.DashboardLayout })),
);
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Projects = lazy(() => import('./pages/Projects').then((m) => ({ default: m.Projects })));
const Workspaces = lazy(() => import('./pages/Workspaces').then((m) => ({ default: m.Workspaces })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

// ---------------------------------------------------------------------------
// Shorthand — createElement without JSX keeps this file as plain .ts
// so Vite's React plugin never touches it (no Fast Refresh warnings).
// ---------------------------------------------------------------------------
const el = createElement;

// ---------------------------------------------------------------------------
// Loaders — closed over the singleton queryClient
// ---------------------------------------------------------------------------
const authLoader = async () => {
  try {
    const cached = queryClient.getQueryData<{ user: unknown }>(['me']);
    if (cached?.user) return null;
    const data = await authApi.me();
    queryClient.setQueryData(['me'], data);
    return null;
  } catch {
    return redirect('/login');
  }
};

const guestLoader = async () => {
  try {
    const cached = queryClient.getQueryData<{ user: unknown }>(['me']);
    if (cached?.user) return redirect('/dashboard');
    const data = await authApi.me();
    queryClient.setQueryData(['me'], data);
    return redirect('/dashboard');
  } catch {
    return null;
  }
};

// ---------------------------------------------------------------------------
// Route tree
// ---------------------------------------------------------------------------
export const routes = [
  {
    element: el(RootLayout),
    errorElement: el(RouteError),
    children: [
      {
        path: '/',
        element: el(Landing),
        handle: {
          title: 'Fluid Studio — Where ideas flow without friction',
          description:
            'A collaborative digital canvas where teams flow from ideation to execution without the friction of traditional management tools.',
        } satisfies RouteMeta,
      },
      {
        path: '/login',
        loader: guestLoader,
        element: el(Login),
        handle: {
          title: 'Sign in — Fluid Studio',
          description: 'Sign in to your Fluid Studio workspace.',
        } satisfies RouteMeta,
      },
      {
        path: '/signup',
        loader: guestLoader,
        element: el(Signup),
        handle: {
          title: 'Get started — Fluid Studio',
          description: 'Create your Fluid Studio account and start collaborating in minutes.',
        } satisfies RouteMeta,
      },

      // Protected routes — loader redirects to /login if unauthenticated
      {
        path: '/dashboard',
        loader: authLoader,
        element: el(DashboardLayout),
        children: [
          {
            index: true,
            element: el(Home),
            handle: {
              title: 'Home — Fluid Studio',
              description: 'Your collaborative workspace overview.',
            } satisfies RouteMeta,
          },
          {
            path: 'projects',
            element: el(Projects),
            handle: {
              title: 'Projects — Fluid Studio',
              description: 'Manage your boards and tasks.',
            } satisfies RouteMeta,
          },
          {
            path: 'workspaces',
            element: el(Workspaces),
            handle: {
              title: 'Workspaces — Fluid Studio',
              description: 'Manage your environments.',
            } satisfies RouteMeta,
          },
        ],
      },

      // 404 catch-all — must be last
      {
        path: '*',
        element: el(NotFound),
        handle: {
          title: '404 — Page not found | Fluid Studio',
        } satisfies RouteMeta,
      },
    ],
  },
];
