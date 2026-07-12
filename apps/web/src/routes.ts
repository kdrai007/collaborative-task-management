import { createElement } from 'react';
import { redirect } from 'react-router';
import { queryClient } from './lib/queryClient';
import { authApi } from './lib/api';
import { RootLayout, RouteError } from './layouts/RootLayout';
import type { RouteMeta } from './types/route';

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
// Route tree — leveraging React Router v7 native lazy routing to parallelize
// loading of JS chunks and execution of route loaders.
// ---------------------------------------------------------------------------
export const routes = [
  {
    element: createElement(RootLayout),
    errorElement: createElement(RouteError),
    children: [
      {
        path: '/',
        lazy: () => import('./pages/Landing').then((m) => ({ Component: m.Landing })),
        handle: {
          title: 'Fluid Studio — Where ideas flow without friction',
          description:
            'A collaborative digital canvas where teams flow from ideation to execution without the friction of traditional management tools.',
        } satisfies RouteMeta,
      },
      {
        path: '/login',
        loader: guestLoader,
        lazy: () => import('./pages/Login').then((m) => ({ Component: m.Login })),
        handle: {
          title: 'Sign in — Fluid Studio',
          description: 'Sign in to your Fluid Studio workspace.',
        } satisfies RouteMeta,
      },
      {
        path: '/signup',
        loader: guestLoader,
        lazy: () => import('./pages/Signup').then((m) => ({ Component: m.Signup })),
        handle: {
          title: 'Get started — Fluid Studio',
          description: 'Create your Fluid Studio account and start collaborating in minutes.',
        } satisfies RouteMeta,
      },

      // Protected routes — loader redirects to /login if unauthenticated
      {
        path: '/dashboard',
        loader: authLoader,
        lazy: () => import('./layouts/DashboardLayout').then((m) => ({ Component: m.DashboardLayout })),
        children: [
          {
            index: true,
            lazy: () => import('./pages/Home').then((m) => ({ Component: m.Home })),
            handle: {
              title: 'Home — Fluid Studio',
              description: 'Your collaborative workspace overview.',
            } satisfies RouteMeta,
          },
          {
            path: 'projects',
            lazy: () => import('./pages/Projects').then((m) => ({ Component: m.Projects })),
            handle: {
              title: 'Projects — Fluid Studio',
              description: 'Manage your boards and tasks.',
            } satisfies RouteMeta,
          },
          {
            path: 'workspaces',
            lazy: () => import('./pages/Workspaces').then((m) => ({ Component: m.Workspaces })),
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
        lazy: () => import('./pages/NotFound').then((m) => ({ Component: m.NotFound })),
        handle: {
          title: '404 — Page not found | Fluid Studio',
        } satisfies RouteMeta,
      },
    ],
  },
];

