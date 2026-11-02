//#region imports
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
  type ReactNode
} from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { User } from '../../types/user';
import type { SignInData, SignUpData } from '../../types/auth';
import { AuthContext } from './AuthContext';
import {
  mapProfileToUser,
  mapSignUpDataToRegisterRequest
} from '../../api/auth';
import {
  getProfile,
  logIn,
  logOut,
  refreshToken,
  registerUser
} from '../../api/auth';
import { setRefreshHandler } from '../../api/httpClient';
import { isAuthFailure } from '../../api/isAuthFailure';
//#endregion

interface Props {
  children: ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  //#region states
  const [token, setToken] = useLocalStorage<string | null>(null, 'accessToken');
  const [refreshTokenValue, setRefreshTokenValue] = useLocalStorage<
    string | null
  >(null, 'refreshToken');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  //#endregion

  //#region session helpers
  const loadAndSetUser = useCallback(async (access: string) => {
    const profile = await getProfile(access);
    setUser(mapProfileToUser(profile));
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    setRefreshTokenValue(null);
  }, [setUser, setToken, setRefreshTokenValue]);
  //#endregion

  //#region session restoration
  const refreshTokenRef = useRef(refreshTokenValue);

  useEffect(() => {
    refreshTokenRef.current = refreshTokenValue;
  }, [refreshTokenValue]);

  const refreshInFlight = useRef<Promise<string | null> | null>(null);

  const refreshSession = useCallback(async () => {
    if (refreshInFlight.current) return refreshInFlight.current;

    const current = refreshTokenRef.current;
    if (!current) return null;

    refreshInFlight.current = (async () => {
      try {
        const { access, refresh } = await refreshToken(current);

        refreshTokenRef.current = refresh;
        setToken(access);
        setRefreshTokenValue(refresh);
        return access;
      } catch (err) {
        if (isAuthFailure(err) && refreshTokenRef.current === current) {
          clearSession();
        }
        return null;
      } finally {
        refreshInFlight.current = null;
      }
    })();

    return refreshInFlight.current;
  }, [setToken, setRefreshTokenValue, clearSession]);

  useEffect(() => {
    setRefreshHandler(refreshSession);
  }, [refreshSession]);

  useEffect(() => {
    restoreSession();

    async function restoreSession () {
      try {
        if (token) {
          await loadAndSetUser(token);
        } else if (refreshTokenRef.current) {
          const access = await refreshSession();
          if (access) await loadAndSetUser(access);
        }
      } catch (err) {
        if (isAuthFailure(err)) clearSession();
      } finally {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region auth actions
  const signUp = useCallback(async (data: SignUpData) => {
    await registerUser(mapSignUpDataToRegisterRequest(data));
  }, []);

  const signIn = useCallback(
    async (data: SignInData) => {
      const response = await logIn(data);
      setToken(response.access);
      setRefreshTokenValue(response.refresh);

      try {
        await loadAndSetUser(response.access);
      } catch (err) {
        clearSession();
        throw err;
      }
    },
    [setToken, setRefreshTokenValue, clearSession, loadAndSetUser]
  );

  const signOut = useCallback(async () => {
    try {
      const refresh = refreshTokenRef.current;
      if (!refresh) return;

      try {
        if (!token) throw new Error('no access token');
        await logOut(refresh, token);
      } catch {
        const access = await refreshSession();

        if (access && refreshTokenRef.current) {
          await logOut(refreshTokenRef.current, access);
        }
      }
    } catch {
      // local sign out
    } finally {
      clearSession();
    }
  }, [token, refreshSession, clearSession]);
  //#endregion

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isOrganizerOrAdmin:
          user?.role === 'organizer' || user?.role === 'admin',
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
