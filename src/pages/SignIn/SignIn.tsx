//#region imports
import { Link } from 'react-router';
import { AuthLayout } from '../../components/AuthLayout';
import { SingInForm } from './components/SingInForm';
//#endregion

export const SignIn = () => {
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
