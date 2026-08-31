export const getErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Try again.'
): string => {
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  if ('detail' in error && typeof error.detail === 'string') {
    return error.detail;
  }

  for (const value of Object.values(error)) {
    if (Array.isArray(value) && typeof value[0] === 'string') {
      return value[0];
    }
  }

  return fallback;
};
