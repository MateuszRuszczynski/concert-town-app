//#region imports
import { Link } from "react-router";
import { usePageTitle } from "../../hooks/usePageTitle";
import { SignUpForm } from "./components/SignUpForm";
import { AuthLayout } from "../../components/layout/AuthLayout";
//#endregion

export const SignUp = () => {
  usePageTitle('Sign Up');

  return (
    <AuthLayout
      title='Create your Concert Town account'
      subtitle='Sign up to start managing your events.'
      authSwitch={
        <>
          Already have an account? <Link to='/sign-in'>Sign in</Link>
        </>
      }
    >
      <SignUpForm />
    </AuthLayout>
  );
};
