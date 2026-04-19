import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './router';

export default function App() {
  return (
    <>
      <Toaster richColors />
      <RouterProvider router={router} />
    </>
  );
}
