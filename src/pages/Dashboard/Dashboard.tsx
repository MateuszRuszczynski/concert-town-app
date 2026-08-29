import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { usePageTitle } from '../../hooks/usePageTitle';
import styles from './Dashboard.module.scss';

export const Dashboard = () => {
  const { user } = useAuth();
  usePageTitle('Dashboard');

  return (
    <section className={styles.dashboard}>
      <PageHeader
        title='Dashboard'
        subtitle={`Welcome back, ${user?.firstName}. Here's how your events are performing.`}
      />
    </section>
  );
};
