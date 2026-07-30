//#region imports
import { Button } from '../../../../components/Button';
import { Form } from '../../../../components/Form';
import { FormField } from '../../../../components/FormField';
import { useSignInForm } from '../../hooks/useSignInForm';
//#endregion

export const SingInForm = () => {
  const { inputControls, validation, submission } = useSignInForm();
  const { email, setEmail, password, setPassword } = inputControls;
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
        type='password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        errorMessage={fieldErrors.password}
        placeholder='• • • • • • • •'
        required
      />

      <Button type='submit' isLoading={isSubmitting}>
        {isSubmitting ? 'Please wait...' : 'Sign in'}
      </Button>
    </Form>
  );
};
