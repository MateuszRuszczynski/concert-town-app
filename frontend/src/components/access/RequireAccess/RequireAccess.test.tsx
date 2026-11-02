//#region imports
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { vi, describe, it, expect } from 'vitest';
import { RequireAccess } from './RequireAccess';
//#endregion

const useAuth = vi.fn();
vi.mock('../../../contexts/AuthContext/useAuth.ts', () => ({ useAuth: () => useAuth() }));

function renderAccess () {
  return render(
    <MemoryRouter initialEntries={['/secret']}>
      <Routes>
        <Route
          element={
            <RequireAccess
              fallback={<p>loading</p>}
              unauthenticatedMessage='Sign in to continue'
            />
          }
        >
          <Route path='/secret' element={<p>secret content</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('RequireAccess', () => {
  it('shows the fallback while loading', () => {
    useAuth.mockReturnValue({ isLoading: true });
    renderAccess();
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('asks to sign in when unauthenticated', () => {
    useAuth.mockReturnValue({ isLoading: false, isAuthenticated: false });
    renderAccess();
    expect(screen.getByText('Sign in to continue')).toBeInTheDocument();
  });

  it('renders the page for an authenticated user', () => {
    useAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { role: 'customer' }
    });
    renderAccess();
    expect(screen.getByText('secret content')).toBeInTheDocument();
  });
});
