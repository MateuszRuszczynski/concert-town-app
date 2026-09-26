//#region imports
import { useAuth } from '../../contexts/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { CustomerDashboard } from './components/CustomerDashboard';
import { ErrorPage } from '../ErrorPage';
//#endregion

export const Dashboard = () => {
  usePageTitle('Dashboard');

  const { user } = useAuth();

  if (!user) {
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

  const isOrganizer = user.role === 'organizer' || user?.role === 'admin';

  return isOrganizer ? <OrganizerDashboard /> : <CustomerDashboard />;
};
