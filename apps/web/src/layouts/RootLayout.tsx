import { Outlet, useMatches } from 'react-router';
import { Suspense, useEffect } from 'react';
import type { RouteMeta } from '../types/route';

// ---------------------------------------------------------------------------
// Root layout — wraps every route; updates <title> and <meta description>
// on each navigation using the matched route's handle.
// ---------------------------------------------------------------------------
export function RootLayout() {
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
export function RouteError() {
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
