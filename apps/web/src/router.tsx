import { createBrowserRouter, Outlet, redirect, useMatches } from 'react-router';
import { lazy, Suspense, useEffect } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { authApi } from './lib/api';

// ---------------------------------------------------------------------------
// Lazy-loaded page components — each route gets its own JS chunk
// ---------------------------------------------------------------------------
const Landing = lazy(() => import('./pages/Landing').then((m) => ({ default: m.Landing })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Signup = lazy(() => import('./pages/Signup').then((m) => ({ default: m.Signup })));
const DashboardLayout = lazy(() =>
  import('./layouts/DashboardLayout').then((m) => ({ default: m.DashboardLayout })),
);
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

// ---------------------------------------------------------------------------
// Route handle — carries per-route meta for the document <head>
// ---------------------------------------------------------------------------
export interface RouteMeta {
  title: string;
  description?: string;
}

// ---------------------------------------------------------------------------
// Root layout — wraps every route; updates <title> and <meta description>
// on each navigation using the matched route's handle.
// ---------------------------------------------------------------------------
function RootLayout() {
  const matches = useMatches();

  useEffect(() => {
    const meta = [...matches]
      .reverse()
      .map((m) => m.handle as RouteMeta | undefined)
      .find((h) => h?.title);

    if (!meta) return;

    document.title = meta.title;

    let descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta.description) {
      if (!descEl) {
        descEl = document.createElement('meta');
        descEl.name = 'description';
        document.head.appendChild(descEl);
      }
      descEl.content = meta.description;
    }
  }, [matches]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center font-body text-on-surface">
          Loading…
        </div>
      }
    >
      <Outlet />
    </Suspense>
  );
}

// ---------------------------------------------------------------------------
// Generic route error boundary element
// ---------------------------------------------------------------------------
function RouteError() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4 font-body text-on-surface px-6 text-center">
      <p className="text-4xl">⚠️</p>
      <h1 className="text-2xl font-headline font-bold">Something went wrong</h1>
      <p className="text-on-surface-variant">An unexpected error occurred. Please try again.</p>
      <a href="/" className="text-primary font-semibold underline">
        Go home
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Auth loader — runs before protected routes.
// Redirects unauthenticated users to /login.
// ---------------------------------------------------------------------------
function makeAuthLoader(queryClient: QueryClient) {
  return async () => {
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
}

// ---------------------------------------------------------------------------
// Guest loader — runs before public auth routes (/, /login, /signup).
// Redirects already-authenticated users straight to /dashboard.
// ---------------------------------------------------------------------------
function makeGuestLoader(queryClient: QueryClient) {
  return async () => {
    try {
      const cached = queryClient.getQueryData<{ user: unknown }>(['me']);
      if (cached?.user) return redirect('/dashboard');
      const data = await authApi.me();
      queryClient.setQueryData(['me'], data);
      // Authenticated — send to dashboard
      return redirect('/dashboard');
    } catch {
      // Not authenticated — let them stay on the public page
      return null;
    }
  };
}

// ---------------------------------------------------------------------------
// Router factory
// ---------------------------------------------------------------------------
export function createRouter(queryClient: QueryClient) {
  return createBrowserRouter([
    {
      // Root layout — wraps all routes; handles meta + suspense
      element: <RootLayout />,
      errorElement: <RouteError />,
      children: [
        // Public routes — guest loader bounces authenticated users to /dashboard
        {
          path: '/',
          element: <Landing />,
          handle: {
            title: 'Fluid Studio — Where ideas flow without friction',
            description:
              'A collaborative digital canvas where teams flow from ideation to execution without the friction of traditional management tools.',
          } satisfies RouteMeta,
        },
        {
          path: '/login',
          loader: makeGuestLoader(queryClient),
          element: <Login />,
          handle: {
            title: 'Sign in — Fluid Studio',
            description: 'Sign in to your Fluid Studio workspace.',
          } satisfies RouteMeta,
        },
        {
          path: '/signup',
          loader: makeGuestLoader(queryClient),
          element: <Signup />,
          handle: {
            title: 'Get started — Fluid Studio',
            description: 'Create your Fluid Studio account and start collaborating in minutes.',
          } satisfies RouteMeta,
        },

        // Protected routes — loader redirects to /login if unauthenticated
        {
          path: '/dashboard',
          loader: makeAuthLoader(queryClient),
          element: <DashboardLayout />,
          handle: {
            title: 'Dashboard — Fluid Studio',
            description: 'Your collaborative workspace.',
          } satisfies RouteMeta,
        },

        // 404 catch-all — must be last
        {
          path: '*',
          element: <NotFound />,
          handle: {
            title: '404 — Page not found | Fluid Studio',
          } satisfies RouteMeta,
        },
      ],
    },
  ]);
}
