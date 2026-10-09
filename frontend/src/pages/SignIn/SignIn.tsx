//#region imports
import { Link } from 'react-router';
import { usePageTitle } from '../../hooks/usePageTitle';
import { SingInForm } from './components/SignInForm';
import { AuthLayout } from '../../components/layout/AuthLayout';
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
