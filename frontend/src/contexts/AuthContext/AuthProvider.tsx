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
  registerUser,
  type ProfileResponse
} from '../../api/auth';
import { setRefreshHandler } from '../../api/httpClient';
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
  //#endregion

  //#region session helpers
  const loadAndSetUser = useCallback(
    async (access: string) => {
      const profile = await getProfile(access);
      setUser(mapProfileToUser(profile));
    },
    [setUser]
  );

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    setRefreshTokenValue(null);
  }, [setUser, setToken, setRefreshTokenValue]);

  const tryRefreshAndLoadUser = useCallback(
    async (refreshValue: string) => {
      try {
        const { access, refresh } = await refreshToken(refreshValue);
        setToken(access);
        setRefreshTokenValue(refresh);

        await loadAndSetUser(access);
      } catch {
        clearSession();
      }
    },
    [setToken, setRefreshTokenValue, loadAndSetUser, clearSession]
  );
  //#endregion

  ///#region session restoration
  useEffect(() => {
    restoreSession();

    async function restoreSession () {
      if (!token) {
        if (refreshTokenValue) {
          await tryRefreshAndLoadUser(refreshTokenValue);
        } else {
          clearSession();
        }

        setIsLoading(false);
        return;
      }

      try {
        await loadAndSetUser(token);
      } catch {
        if (refreshTokenValue) {
          await tryRefreshAndLoadUser(refreshTokenValue);
        } else {
          clearSession();
        }
      } finally {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshTokenRef = useRef(refreshTokenValue);

  useEffect(() => {
    refreshTokenRef.current = refreshTokenValue;
  }, [refreshTokenValue]);

  useEffect(() => {
    setRefreshHandler(async () => {
      const currentRefresh = refreshTokenRef.current;
      if (!currentRefresh) return null;

      try {
        const { access, refresh } = await refreshToken(currentRefresh);
        setToken(access);
        setRefreshTokenValue(refresh);
        return access;
      } catch {
        clearSession();
        return null;
      }
    });
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

      const profile: ProfileResponse = await getProfile(response.access);
      setUser(mapProfileToUser(profile));
    },
    [setToken, setRefreshTokenValue, setUser]
  );

  const signOut = useCallback(async () => {
    try {
      if (token && refreshTokenValue) {
        await logOut(refreshTokenValue, token);
      }
    } finally {
      clearSession();
    }
  }, [clearSession, refreshTokenValue, token]);
  //#endregion

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
