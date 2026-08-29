import { client } from './httpClient';
import type { LoginPayload, ProfileResponse, RegisterPayload, RegisterResponse, TokenResponse } from './types';

export const authService = {
  register: (data: RegisterPayload) => client.post<RegisterResponse>('/api/auth/register/', data),
  logIn: (data: LoginPayload) => client.post<TokenResponse>('/api/auth/login/', data),
  refreshToken: (refresh: string) => client.post<TokenResponse>('/api/auth/token/refresh/', { refresh: refresh }),
  logOut: (refresh: string, token: string) => client.post('/api/auth/logout/', { refresh: refresh }, {token: token}),
  getProfile: (token: string) => client.get<ProfileResponse>('/api/auth/profile/', {token: token}),
};
