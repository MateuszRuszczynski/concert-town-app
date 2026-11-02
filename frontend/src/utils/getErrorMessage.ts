import { ApiError } from "../api/ApiError";

export const getErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Try again.'
): string => {
  const source = error instanceof ApiError ? error.data : error;

  if (typeof source === 'string' && source.trim()) return source;

  if (!source || typeof source !== 'object') {
    return fallback;
  }

  if ('detail' in source && typeof source.detail === 'string') {
    return source.detail;
  }

  if (source instanceof Error) {
    return source.message;
  }

  for (const value of Object.values(source)) {
    if (Array.isArray(value) && typeof value[0] === 'string') {
      return value[0];
    }
  }

  return fallback;
};
