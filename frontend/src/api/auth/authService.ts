//#region imports
import { get, post, rawClient } from '../httpClient';
import type {
  LoginPayload,
  ProfileResponse,
  RegisterPayload,
  RegisterResponse,
  TokenResponse
} from './authTypes';
//#endregion

export const authService = {
  register: (data: RegisterPayload) =>
    post<RegisterResponse>('/api/auth/register/', data),
  logIn: (data: LoginPayload) => post<TokenResponse>('/api/auth/login/', data),
  refreshToken: (refresh: string) =>
    rawClient.post<TokenResponse>('/api/auth/token/refresh/', {
      refresh
    }),
  logOut: (refresh: string, token: string) =>
    post('/api/auth/logout/', { refresh: refresh }, { token }),
  getProfile: (token: string) =>
    get<ProfileResponse>('/api/auth/profile/', { token })
};

export const {
  register: registerUser,
  logIn,
  refreshToken,
  logOut,
  getProfile
} = authService;
