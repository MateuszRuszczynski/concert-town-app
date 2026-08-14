//#region imports
import { useState } from "react";
import { useSignInForm } from "../../hooks/useSignInForm";
import { FormField } from "../../../../components/FormField";
import { PasswordVisibilityToggle } from "../../../../components/PasswordVisibilityToggle";
import { Button } from "../../../../components/Button";
import { Form } from "../../../../components/Form";
//#endregion

export const SingInForm = () => {
  const { inputControls, validation, submission } = useSignInForm();
  const { email, setEmail, password, setPassword } = inputControls;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { fieldErrors } = validation;
  const { handleSubmit, isSubmitting } = submission;

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
        required
      />

      <Button type='submit' isLoading={isSubmitting}>
        {isSubmitting ? 'Please wait...' : 'Sign in'}
      </Button>
    </Form>
  );
};
