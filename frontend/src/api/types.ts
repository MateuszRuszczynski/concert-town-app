import type { UserRole } from "../types/user";

export interface RegisterPayload {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface ProfileResponse  {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}
