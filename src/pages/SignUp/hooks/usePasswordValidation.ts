import { useMemo } from 'react';

const requirementsList: { label: string; test: (pw: string) => boolean }[] = [
  { label: 'At least 8 characters', test: pw => pw.length >= 8 },
  { label: 'One uppercase letter', test: pw => /[A-Z]/.test(pw) },
  { label: 'One number', test: pw => /\d/.test(pw) },
  { label: 'One special character', test: pw => /[^A-Za-z0-9\s]/.test(pw) },
  { label: 'One lowercase letter', test: pw => /[a-z]/.test(pw) }
];

export function usePasswordValidation (password: string) {
  const requirements = useMemo(
    () =>
      requirementsList.map(req => ({
        label: req.label,
        met: req.test(password)
      })),
    [password]
  );

  const isValid = requirements.every(req => req.met);

  return { requirements, isValid };
}
