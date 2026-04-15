import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { createRouter } from './router';
import { queryClient } from './lib/queryClient';

const router = createRouter(queryClient);

export default function App() {
  return (
    <>
      <Toaster richColors />
      <RouterProvider router={router} />
    </>
  );
}
