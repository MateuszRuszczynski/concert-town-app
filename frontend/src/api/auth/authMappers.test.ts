import { describe, expect, it } from "vitest";
import { mapProfileToUser, mapSignUpDataToRegisterRequest } from "./authMappers";
import type { ProfileResponse } from "./authTypes";

describe('mapProfileToUser', () => {
  it('maps profile response to user', () => {
    const profile:ProfileResponse = {
      id: 1,
      email: 'a@b.com',
      first_name: 'Anna',
      last_name: 'Smith',
      role: 'customer',
    };

    expect(mapProfileToUser(profile)).toEqual({
      id: 1,
      email: 'a@b.com',
      firstName: 'Anna',
      lastName: 'Smith',
      role: 'customer',
    });
  });
});

describe('mapSignUpDataToRegisterRequest', () => {
  it('maps sign-up data to register request', () => {
    const data = {
      email: 'a@b.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      firstName: 'Anna',
      lastName: 'Smith',
    };

    expect(mapSignUpDataToRegisterRequest(data)).toEqual({
      email: 'a@b.com',
      password: 'Password123!',
      password_confirm: 'Password123!',
      first_name: 'Anna',
      last_name: 'Smith',
    });
  });
});
