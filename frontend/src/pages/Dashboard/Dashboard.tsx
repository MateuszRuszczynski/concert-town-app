//#region imports
import { useAuth } from '../../contexts/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { CustomerDashboard } from './components/CustomerDashboard';
import { ErrorPage } from '../ErrorPage';
import { DashboardSkeleton } from './DashboardSkeleton';
//#endregion

export const Dashboard = () => {
  usePageTitle('Dashboard');

  const { isAuthenticated, isOrganizerOrAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <ErrorPage
        type='access-denied'
        title='Sign in required'
        subtitle='Sign in to see an overview of your events and activity.'
        buttonText='Go to sign in'
        backTo='/sign-in'
      />
    );
  }

  return isOrganizerOrAdmin ? <OrganizerDashboard /> : <CustomerDashboard />;
};
