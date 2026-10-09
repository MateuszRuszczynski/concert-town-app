//#region imports
import { useState } from "react";
import { useSignInForm } from "../../hooks/useSignInForm";
import { FormField } from "../../../../components/ui/FormField";
import { PasswordVisibilityToggle } from "../../../../components/ui/PasswordVisibilityToggle";
import { Button } from "../../../../components/ui/Button";
import { Form } from "../../../../components/ui/Form";
import { FormError } from "../../../../components/ui/FormError";
//#endregion

export const SingInForm = () => {
  const { inputControls, validation, submission } = useSignInForm();
  const { email, setEmail, password, setPassword } = inputControls;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { fieldErrors } = validation;
  const { handleSubmit, isSubmitting, submitError } = submission;

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormField
        label='Email'
        id='email'
        type='email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        errorMessage={fieldErrors.email}
        placeholder='you@example.com'
        autoComplete="email"
        required
      />

      <FormField
        label='Password'
        id='password'
        type={isPasswordVisible ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        errorMessage={fieldErrors.password}
        placeholder='• • • • • • • •'
        endAdornment={
          <PasswordVisibilityToggle
            isVisible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible(prev => !prev)}
          />
        }
        autoComplete="current-password"
        required
      />

      {submitError && <FormError errorMessage={submitError} />}

      <Button type='submit' isLoading={isSubmitting}>
        {isSubmitting ? 'Please wait...' : 'Sign in'}
      </Button>
    </Form>
  );
};
