//#region imports
import { FormField } from '../../../../components/FormField';
import { PasswordField } from '../PasswordField';
import { Button } from '../../../../components/Button';
import { Form } from '../../../../components/Form';
import { useSignUpForm } from '../../hooks/useSignUpForm';
import { FormError } from '../../../../components/FormError';
import { useState } from 'react';
import { PasswordVisibilityToggle } from '../../../../components/PasswordVisibilityToggle';
import { Link } from 'react-router';
import { Checkbox } from '../../../../components/Checkbox';
import styles from './SignUpForm.module.scss';
//#endregion

export const SignUpForm = () => {
  const { inputControls, validation, submission } = useSignUpForm();
  const {
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
  } = inputControls;
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const { passwordRequirements, passwordsMatch, isPasswordValid, fieldErrors } =
    validation;
  const { handleSubmit, submitError, isSubmitting } = submission;

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormField
        label='First name'
        id='first-name'
        type='text'
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        errorMessage={fieldErrors.firstName}
        placeholder='Jane'
        required
      />

      <FormField
        label='Last name'
        id='last-name'
        type='text'
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        errorMessage={fieldErrors.lastName}
        placeholder='Doe'
        required
      />

      <FormField
        label='Email'
        id='email'
        type='email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        errorMessage={fieldErrors.email}
        placeholder='you@example.com'
        required
      />

      <PasswordField
        value={password}
        onChange={setPassword}
        requirements={passwordRequirements}
        isValid={isPasswordValid}
        successMessage={
          isPasswordValid ? 'Password meets all requirements' : undefined
        }
        errorMessage={fieldErrors.password}
      />

      <FormField
        label='Repeat password'
        id='repeat-password'
        type={isConfirmVisible ? 'text' : 'password'}
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        successMessage={passwordsMatch ? 'Passwords match' : undefined}
        errorMessage={fieldErrors.confirmPassword}
        placeholder='• • • • • • • •'
        endAdornment={
          <PasswordVisibilityToggle
            isVisible={isConfirmVisible}
            onToggle={() => setIsConfirmVisible(prev => !prev)}
          />
        }
        required
      />

      <Checkbox
        id='terms-consent'
        checked={agreedToTerms}
        onChange={setAgreedToTerms}
        errorMessage={fieldErrors.agreedToTerms}
        label={
          <span className={styles.termsConsent}>
            I agree to the{' '}
            <Link
              to='/terms'
              target='_blank'
              rel='noopener noreferrer'
              className={styles.link}
            >
              Terms and Conditions
            </Link>
          </span>
        }
      />

      {submitError && <FormError errorMessage={submitError} />}

      <Button type='submit' isLoading={isSubmitting}>
        {isSubmitting ? 'Please wait...' : 'Create account'}
      </Button>
    </Form>
  );
};
