//#region imports
import type { SignUpData } from "../types/auth";
import type { User } from "../types/user";
import type { ProfileResponse, RegisterPayload } from "./types";
//#endregion

export function mapProfileToUser(profile: ProfileResponse): User {
  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    role: profile.role,
  };
}

export function mapSignUpDataToRegisterRequest(data: SignUpData): RegisterPayload {
  return {
    email: data.email,
    password: data.password,
    password_confirm: data.confirmPassword,
    first_name: data.firstName,
    last_name: data.lastName,
  };
}
