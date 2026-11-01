//#region imports
import { useAuth } from '../../contexts/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { CustomerDashboard } from './components/CustomerDashboard';
//#endregion

export const Dashboard = () => {
  usePageTitle('Dashboard');

  const { isOrganizerOrAdmin } = useAuth();

  return isOrganizerOrAdmin ? <OrganizerDashboard /> : <CustomerDashboard />;
};
