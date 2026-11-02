//#region imports
import type { FC, ReactNode } from 'react';
import type { EventDetails } from '../../../types/events';
import { EventItem } from '../EventItem';
import { EmptyBlock } from '../../ui/EmptyBlock';
import { EventsListSkeleton } from './EventsListSkeleton';
import { QueryError } from '../../ui/QueryError';
import styles from './base.module.scss';
//#endregion

interface Props {
  events: EventDetails[];
  isLoading: boolean;
  emptyState?: ReactNode;
  error?: unknown;
}

export const EventsList: FC<Props> = ({
  events,
  isLoading,
  emptyState,
  error
}) => {
  if (isLoading) {
    return <EventsListSkeleton />;
  }

  if (error)
    return <QueryError error={error} fallback='Failed to load events.' />;

  if (events.length === 0) {
    return (
      emptyState || (
        <EmptyBlock emptyMessage={'No events match your filters.'} />
      )
    );
  }

  return (
    <ul className={styles.eventsList}>
      {events.map(event => (
        <li key={event.id}>
          <EventItem event={event} />
        </li>
      ))}
    </ul>
  );
};
