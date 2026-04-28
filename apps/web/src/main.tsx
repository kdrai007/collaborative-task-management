import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import '@/index.css';
import App from '@/App.tsx';
import { Toaster } from '@/components/ui/Sonner';

import { ThemeProvider } from '@/providers/theme-provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="app-ui-theme">
        <Toaster />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
