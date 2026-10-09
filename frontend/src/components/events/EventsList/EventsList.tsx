//#region imports
import type { FC, ReactNode } from 'react';
import type { EventDetails } from '../../../types/events';
import { EventItem } from '../EventItem';
import { EmptyBlock } from '../../ui/EmptyBlock';
import { EventsListSkeleton } from './EventsListSkeleton';
import styles from './base.module.scss';
//#endregion

interface Props {
  events: EventDetails[];
  isLoading: boolean;
  emptyState?: ReactNode,
}

export const EventsList: FC<Props> = ({
  events,
  isLoading,
  emptyState
}) => {
  if (isLoading) {
    return <EventsListSkeleton />;
  }

  if (events.length === 0) {
    return emptyState || <EmptyBlock emptyMessage={'No events match your filters.'} />;; 
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
