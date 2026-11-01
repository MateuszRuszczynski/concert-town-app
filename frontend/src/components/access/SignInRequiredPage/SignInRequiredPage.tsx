//#region imports
import type { FC } from 'react';
import { ErrorPage } from '../../../pages/ErrorPage';
//#endregion

interface Props {
  subtitle: string;
};

export const SignInRequiredPage: FC<Props> = ({ subtitle }) => (
  <ErrorPage
    type='access-denied'
    title='Sign in required'
    subtitle={subtitle}
    buttonText='Go to sign in'
    backTo='/sign-in'
  />
);
