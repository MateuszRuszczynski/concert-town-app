//#region imports
import { Button } from '../../../../components/Button';
import { PageHeader } from '../../../../components/PageHeader';
import { useAuth } from '../../../../contexts/AuthContext';
import { AttendeePanel } from '../AttendeePanel';
import styles from './CustomerDashboard.module.scss';
//#endregion

export const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <section className={styles.dashboard}>
      <div className={styles.header}>
        <PageHeader
          title='Dashboard'
          subtitle={`Welcome back, ${user?.firstName} Here's what's coming up for you.`}
        />

        <Button fitContent={true} onClick={() => {}}>
          Become an organizer
        </Button>
      </div>

      <AttendeePanel />
    </section>
  );
};
