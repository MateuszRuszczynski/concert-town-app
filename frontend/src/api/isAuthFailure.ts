import { ApiError } from './ApiError';

export const isAuthFailure = (err: unknown) =>
  err instanceof ApiError && (err.status === 400 || err.status === 401);
