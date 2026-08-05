//#region imports
import { Link, useLocation } from 'react-router';
import { AuthLayout } from '../../components/AuthLayout';
import { SingInForm } from './components/SignInForm';
import { useState } from 'react';
import { Toast } from '../../components/Toast';
import { usePageTitle } from '../../hooks/usePageTitle';
//#endregion

export const SignIn = () => {
  const location = useLocation();
  const [showToast, setShowToast] = useState(Boolean(location.state?.justSignedUp));

  usePageTitle('Sign In');

  return (
    <>
      {showToast && (
        <Toast
          message='Account created successfully!'
          onDismiss={() => setShowToast(false)}
        />
      )}

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
    </>
  );
};
