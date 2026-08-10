//#region imports
import { EventItem } from '../../components/EventItem';
import { PageHeader } from '../../components/PageHeader';
import { useEvents } from '../../contexts/useEvents';
import styles from './Events.module.scss';
//#endregion

export const Events = () => {
  const { events } = useEvents();

  return (
    <section className={styles.events}>
      <PageHeader
        title='Events'
        subtitle='Manage and track all of your events.'
      />

      <ul className={styles.eventsList}>
        {events.map(event => (
          <li key={event.id} className={styles.eventListItem}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    </section>
  );
};
