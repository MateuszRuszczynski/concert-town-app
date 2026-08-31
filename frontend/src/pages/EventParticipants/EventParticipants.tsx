//#region imports
import { useParams } from 'react-router';
import { usePageTitle } from '../../hooks/usePageTitle';
import { BackLink } from '../../components/BackLink/BackLink';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { useEvents } from '../../contexts/EventContext';
import { EventNotFound } from '../EventPage/components/EventNotFound';
import { ParticipantsTable } from './components/ParticipantsTable';
import styles from './EventParticipants.module.scss';
//#endregion

export const EventParticipants = () => {
  const { id } = useParams<{ id: string }>();
  const { events } = useEvents();

  const event = events.find(e => e.id === id);

  usePageTitle(event ? `Participants — ${event.title}` : 'Participants');

  if (!event) {
    return <EventNotFound />;
  }

  return (
    <section className={styles.eventParticipants}>
      <div className={styles.topBar}>
        <BackLink to={`/events/${event.id}`} label='Back to event' />

        <PageHeader
          title='Participants'
          subtitle={`${event.registeredCount} people registered for ${event.title}.`}
        />
      </div>

      <ParticipantsTable participants={event.participants ?? []} />
    </section>
  );
};
