import { createBrowserRouter } from 'react-router';
import { routes } from './routes';

// Re-export RouteMeta so consumers can still import it from this module
export type { RouteMeta } from './types/route';

// ---------------------------------------------------------------------------
// Singleton router — no JSX, no component declarations, Fast Refresh-safe
// ---------------------------------------------------------------------------
export const router = createBrowserRouter(routes);
