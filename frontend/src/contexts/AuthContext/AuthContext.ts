//#region imports
import { createContext } from 'react';
import type { SignInData, SignUpData } from '../../types/auth';
import type { User } from '../../types/user';
//#endregion

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isOrganizerOrAdmin: boolean;
  isLoading: boolean;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
