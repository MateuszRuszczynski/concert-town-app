//#region imports
import { useCallback, useState, type FC, type ReactNode } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { User } from '../../types/user';
import type { SignInData, SignUpData } from '../../types/auth';
import { simulateDelay } from '../../utils/simulateDelay';
import { AuthContext } from './AuthContext';
//#endregion

type Props = {
  children: ReactNode;
};

export const AuthProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>(null, 'currentUser');
  const [isLoading] = useState(false);

  const signUp = useCallback(
    async (data: SignUpData) => {
      await simulateDelay();

      const newUser: User = {
        id: crypto.randomUUID(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      };

      setUser(newUser);
    },
    [setUser]
  );

  const signIn = useCallback(
    async (data: SignInData) => {
      await simulateDelay();

      const existingUser: User = {
        id: crypto.randomUUID(),
        firstName: 'Test',
        lastName: 'User',
        email: data.email
      };

      setUser(existingUser);
    },
    [setUser]
  );

  const signOut = useCallback(async () => {
    await simulateDelay();

    setUser(null);
  }, [setUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        signUp,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
