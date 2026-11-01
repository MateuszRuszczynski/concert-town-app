//#region imports
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/global.scss';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queries/queryClient.ts';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
//#endregion

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
