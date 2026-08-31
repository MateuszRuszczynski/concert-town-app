import { useState, type SubmitEventHandler } from 'react';
import {
  validateEmail,
  validatePasswordCharacters
} from '../../../utils/validation';
import { useAuth } from '../../../contexts/AuthContext/useAuth';
import { useNavigate } from 'react-router';
import { getAuthErrorMessage } from '../../../api/getAuthErrorMessage';
import { useNotification } from '../../../contexts/NotificationContext';
import { capitalizeFirstWord } from '../../../utils/capitalizeFirstWord';

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
    password:
      password.length === 0
        ? 'Password is required'
        : validatePasswordCharacters(password)
  };

  const isFormValid = Object.values(rawFieldErrors).every(
    error => error === undefined
  );

  const fieldErrors = hasAttemptedSubmit
    ? rawFieldErrors
    : { email: undefined, password: undefined };

  const validation = {
    fieldErrors,
    isFormValid
  };
  //#endregion

  //#region submission
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { showToast } = useNotification();

  const navigate = useNavigate();

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();

    setHasAttemptedSubmit(true);

    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      await signIn({ email, password });
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = capitalizeFirstWord(
        getAuthErrorMessage(err, 'Failed to sign in. Please try again.')
      );

      showToast(errorMessage, 'error');
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
