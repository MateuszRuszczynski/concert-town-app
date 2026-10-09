//#region imports
import { useState } from 'react';
import cn from 'classNames';
import { useAuth } from '../../../../contexts/AuthContext';
import { OrganizerPanel } from '../OrganizerPanel';
import { AttendeePanel } from '../AttendeePanel';
import { AddEventButton } from '../../../../components/events/AddEventButton';
import { PageHeader } from '../../../../components/ui/PageHeader';
import styles from './OrganizerDashboard.module.scss';
//#endregion

export const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'organizer' | 'attendee'>(
      'organizer'
    );

  return (
    <section className={styles.dashboard}>
      <div className={styles.header}>
        <PageHeader
          title='Dashboard'
          subtitle={`Welcome back, ${user?.firstName}. Here's how your events are performing.`}
        />

        <AddEventButton fitContent={true} />
      </div>

      <div className={styles.dashboardTabs}>
        <button
          className={cn(styles.pillTab, {
            [styles.active]: activeTab === 'organizer'
          })}
          onClick={() => setActiveTab('organizer')}
        >
          Organizer panel
        </button>
        <button
          className={cn(styles.pillTab, {
            [styles.active]: activeTab === 'attendee'
          })}
          onClick={() => setActiveTab('attendee')}
        >
          Attendee panel
        </button>
      </div>

      {activeTab === 'organizer' ? <OrganizerPanel /> : <AttendeePanel />}
    </section>
  )
}
