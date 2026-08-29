//#region imports
import {
  useCallback,
  useEffect,
  useState,
  type FC,
  type ReactNode
} from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { User } from '../../types/user';
import type { SignInData, SignUpData } from '../../types/auth';
import { AuthContext } from './AuthContext';
import { authService } from '../../api/authService';
import {
  mapProfileToUser,
  mapSignUpDataToRegisterRequest
} from '../../api/mappers';
import type { ProfileResponse } from '../../api/types';
//#endregion

type Props = {
  children: ReactNode;
};

export const AuthProvider: FC<Props> = ({ children }) => {
  //#region states
  const [token, setToken] = useLocalStorage<string | null>(null, 'accessToken');
  const [refreshTokenValue, setRefreshTokenValue] = useLocalStorage<
    string | null
  >(null, 'refreshToken');
  const [user, setUser] = useLocalStorage<User | null>(null, 'currentUser');
  const [isLoading, setIsLoading] = useState(true);

  const { register, logIn, logOut, getProfile, refreshToken } = authService;
  //#endregion

  //#region session helpers
  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    setRefreshTokenValue(null);
  }, [setUser, setToken, setRefreshTokenValue]);
  //#endregion

  ///#region session restoration
  useEffect(() => {
    restoreSession();

    async function restoreSession () {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getProfile(token);
        setUser(mapProfileToUser(profile));
      } catch {
        if (!refreshTokenValue) {
          clearSession();
          setIsLoading(false);
          return;
        }

        try {
          const { access, refresh } = await refreshToken(refreshTokenValue);

          setToken(access);
          setRefreshTokenValue(refresh);

          const profile = await getProfile(access);
          setUser(mapProfileToUser(profile));
        } catch {
          clearSession();
        }
      } finally {
        setIsLoading(false);
      }
    }
  }, [token]);
  //#endregion

  //#region auth actions
  const signUp = useCallback(async (data: SignUpData) => {
    await register(mapSignUpDataToRegisterRequest(data));
  }, [register]);

  const signIn = useCallback(
    async (data: SignInData) => {
      const response = await logIn(data);
      setToken(response.access);
      setRefreshTokenValue(response.refresh);

      const profile: ProfileResponse = await getProfile(response.access);
      setUser(mapProfileToUser(profile));
    },
    [setToken, setRefreshTokenValue, getProfile, logIn, setUser]
  );

  const signOut = useCallback(async () => {
    if (token && refreshTokenValue) {
      await logOut(refreshTokenValue, token);
    }

    clearSession();
  }, [clearSession, logOut, refreshTokenValue, token]);
  //#endregion

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
