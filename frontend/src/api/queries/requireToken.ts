export function requireToken(token: string | null): asserts token is string  {
  if (!token) throw new Error('Not authenticated');
};
