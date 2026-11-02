//#region imports
import type { FC, ReactNode } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { ErrorPage } from "../../../pages/ErrorPage";
import { Outlet } from "react-router";
//#endregion

interface Props {
  fallback: ReactNode;
};

export const RequireAdmin:FC<Props> = ({ fallback }) => {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return <>{fallback}</>
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <ErrorPage
        type='access-denied'
        title='Admin access required'
        subtitle='This page is only available to administrators.'
        buttonText={isAuthenticated ? 'Back to Dashboard' : 'Back to events'}
        backTo={isAuthenticated ? '/dashboard' : '/events'}
      />
    );
  }

  return <Outlet />;
};
