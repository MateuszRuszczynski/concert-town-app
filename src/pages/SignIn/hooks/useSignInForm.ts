import { useState, type SubmitEventHandler } from 'react';
import { validateEmail, validatePasswordCharacters } from '../../../utils/validation';

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
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const rawFieldErrors = {
    email: validateEmail(email),
    password: password.length === 0 ? 'Password is required' : validatePasswordCharacters(password),
  };

  const isFormValid = Object.values(rawFieldErrors).every((error) => error === undefined);

  const fieldErrors = hasAttemptedSubmit
    ? rawFieldErrors
    : { email: undefined, password: undefined };

  const validation = {
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
      setHasAttemptedSubmit(false);
    }, 500);
  };

  const submission = {
    isSubmitting,
    submitError,
    handleSubmit
  };
  //#endregion

  return {
    inputControls,
    validation,
    submission
  };
}
