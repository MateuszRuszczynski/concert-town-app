//#region imports
import { useState, type SubmitEventHandler } from 'react';
import { usePasswordValidation } from './usePasswordValidation';
import { useNavigate } from 'react-router';
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordMatch
} from '../../../utils/validation';
import { useNotification } from '../../../contexts/NotificationContext';
//#endregion

export function useSignUpForm () {
  //#region input controls
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
    setConfirmPassword,
    agreedToTerms,
    setAgreedToTerms
  };
  //#endregion

  //#region validation
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const { requirements: passwordRequirements, isValid: isPasswordValid } =
    usePasswordValidation(password);
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    confirmPassword === password;
  const passwordMismatchError =
    confirmPassword.length > 0 && !passwordsMatch
      ? "Passwords don't match"
      : undefined;

  const rawFieldErrors = {
    firstName: validateName(firstName),
    lastName: validateName(lastName),
    email: validateEmail(email),
    password: validatePassword(password, isPasswordValid),
    confirmPassword: validatePasswordMatch(password, confirmPassword),
    agreedToTerms: !agreedToTerms
      ? 'You must agree to the Terms and Conditions'
      : undefined
  };

  const isFormValid = Object.values(rawFieldErrors).every(
    error => error === undefined
  );

  const visibleFieldErrors = hasAttemptedSubmit
    ? rawFieldErrors
    : {
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        password: undefined,
        confirmPassword: undefined,
        agreedToTerms: undefined
      };

  const fieldErrors = {
    ...visibleFieldErrors,
    confirmPassword: passwordMismatchError ?? visibleFieldErrors.confirmPassword
  };

  const validation = {
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
  const { showToast } = useNotification();

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
      showToast('Account created successfully!', 'success');
      navigate('/sign-in');
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
