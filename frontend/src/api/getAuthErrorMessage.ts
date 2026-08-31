import { getErrorMessage } from '../utils/getErrorMessage';

const AUTH_ERROR_OVERRIDES: Record<string, string> = {
  'No active account found with the given credentials':
    'Incorrect email or password.'
};

export function getAuthErrorMessage (error: unknown, fallback?: string): string {
  const message = getErrorMessage(error, fallback);
  return AUTH_ERROR_OVERRIDES[message] ?? message;
}
