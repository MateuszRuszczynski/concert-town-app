//#region imports
import { useParams } from 'react-router';
import { useEvents } from '../../contexts/EventContext';
import { EventNotFound } from './components/EventNotFound';
import { EventHero } from './components/EventHero';
import { EventHeader } from './components/EventHeader';
import { EventDescription } from './components/EventDescription';
import { RegistrationProgress } from './components/RegistrationProgress';
import { EventInfoPanel } from './components/EventInfoPanel';
import { EventActions } from './components/EventActions';
import { usePageTitle } from '../../hooks/usePageTitle';
import { BackLink } from '../../components/BackLink';
import styles from './EventPage.module.scss';
//#endregion

export const EventPage = () => {
  const { id } = useParams<{ id: string }>();
  const { events } = useEvents();

  const event = events.find(e => e.id === id);

  usePageTitle(event?.title || 'Event Not Found');

  if (!event) {
    return <EventNotFound />;
  }

  return (
    <section className={styles.eventPage}>
      <BackLink to='/events' label='Back to events' />

      <EventHero event={event} />

      <div className={styles.contentGrid}>
        <div className={styles.mainColumn}>
          <EventHeader event={event} />

          <EventDescription description={event.description} />

          <RegistrationProgress
            registeredCount={event.registeredCount}
            capacity={event.capacity}
          />
        </div>

        <div className={styles.sideColumn}>
          <EventInfoPanel event={event} />

          <EventActions event={event} />
        </div>
      </div>
    </section>
  );
};
