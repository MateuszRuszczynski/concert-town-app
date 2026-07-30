import { useMemo, useState, type SubmitEventHandler } from 'react';
import { usePasswordValidation } from './usePasswordValidation';
import { useNavigate } from 'react-router';

export function useSignUpForm () {
  //#region input controls
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const inputControls = {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword
  };
  //#endregion

  //#region validation
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const isEmailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );
  const { requirements: passwordRequirements, isValid: isPasswordValid } =
    usePasswordValidation(password);
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    confirmPassword === password;

  const isFormValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    isEmailValid &&
    isPasswordValid &&
    passwordsMatch;

  const rawFieldErrors = {
    firstName:
      firstName.trim().length === 0 ? 'First name is required' : undefined,
    lastName:
      lastName.trim().length === 0 ? 'Last name is required' : undefined,
    email:
      email.trim().length === 0
        ? 'Email is required'
        : !isEmailValid
        ? 'Enter a valid email address'
        : undefined,
    password:
      password.length === 0
        ? 'Password is required'
        : !isPasswordValid
        ? 'Password does not meet all requirements'
        : undefined,
    confirmPassword:
      confirmPassword.length === 0
        ? 'Please repeat your password'
        : !passwordsMatch
        ? "Passwords don't match"
        : undefined
  };

  const fieldErrors = hasAttemptedSubmit
    ? rawFieldErrors
    : {
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        password: undefined,
        confirmPassword: undefined
      };

  const validation = {
    isEmailValid,
    passwordRequirements,
    isPasswordValid,
    passwordsMatch,
    isFormValid,
    fieldErrors
  };

  //#endregion

  //#region submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/sign-in');
    }, 500);

    // navigate('/sign-in');
  };

  const submission = {
    isSubmitting,
    submitError,
    hasAttemptedSubmit,
    handleSubmit
  };
  //#endregion

  return {
    inputControls,
    validation,
    submission
  };
}
