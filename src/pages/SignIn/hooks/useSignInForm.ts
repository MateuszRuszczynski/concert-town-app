import { useMemo, useState, type SubmitEventHandler } from 'react';

export function useSignInForm () {
  //#region input controls
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const inputControls = {
    email,
    setEmail,
    password,
    setPassword
  };
  //#endregion

  //#region validation
  const isEmailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );
  const isPasswordFilled = password.length > 0;
  const isFormValid = isEmailValid && isPasswordFilled;

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const rawFieldErrors = {
    email:
      email.trim().length === 0
        ? 'Email is required'
        : !isEmailValid
        ? 'Enter a valid email address'
        : undefined,
    password: password.length === 0 ? 'Password is required' : undefined
  };

  const fieldErrors = hasAttemptedSubmit
    ? rawFieldErrors
    : { email: undefined, password: undefined };

  const validation = {
    isEmailValid,
    fieldErrors,
    isFormValid
  };
  //#endregion

  //#region submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError] = useState<string | null>(null);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    setHasAttemptedSubmit(true);

    if (!isFormValid) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      setPassword('');
      setHasAttemptedSubmit(false); // щоб після очищення не показувались старі fieldErrors
    }, 500);
  };

  const submission = {
    isSubmitting,
    submitError,
    handleSubmit
  };

  return {
    inputControls,
    validation,
    submission
  };
  //#endregion
}
