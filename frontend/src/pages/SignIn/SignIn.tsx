//#region imports
import { Link } from 'react-router';
import { usePageTitle } from '../../hooks/usePageTitle';
import { AuthLayout } from '../../components/AuthLayout';
import { SingInForm } from './components/SignInForm';
//#endregion

export const SignIn = () => {
  usePageTitle('Sign In');

  return (
    <AuthLayout
      title='Welcome back to Concert Town'
      subtitle='Sign in to manage your events.'
      authSwitch={
        <>
          Don't have an account? <Link to='/sign-up'>Sign up</Link>
        </>
      }
    >
      <SingInForm />
    </AuthLayout>
  );
};
