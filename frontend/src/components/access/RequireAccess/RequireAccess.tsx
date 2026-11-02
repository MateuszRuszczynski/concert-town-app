//#region imports
import type { FC, ReactNode } from 'react';
import { Outlet } from 'react-router';
import { useAuth } from '../../../contexts/AuthContext/useAuth';
import type { UserRole } from '../../../types/user';
import { SignInRequiredPage } from '../SignInRequiredPage';
//#endregion

interface RoleRule {
  role: Exclude<UserRole, 'customer'>;
  content: ReactNode;
}

interface Props {
  fallback: ReactNode;
  unauthenticatedMessage: string;
  roleRule?: RoleRule;
}

export const RequireAccess: FC<Props> = ({
  fallback,
  unauthenticatedMessage,
  roleRule
}) => {
  const { isLoading, isAuthenticated, user, isOrganizerOrAdmin } = useAuth();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return <SignInRequiredPage subtitle={unauthenticatedMessage} />;
  }

  if (roleRule) {
    const allowed =
      roleRule.role === 'admin' ? user?.role === 'admin' : isOrganizerOrAdmin;

    if (!allowed) {
      return <>{roleRule.content}</>;
    }
  }

  return <Outlet />;
};
