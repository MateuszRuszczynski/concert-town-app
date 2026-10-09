//#region imports
import type { FC, ReactNode } from 'react';
import type { EventDetails } from '../../../../types/events';
import { Link } from 'react-router';
import { EventsList } from '../../../../components/events/EventsList';
import { EmptyBlock } from '../../../../components/ui/EmptyBlock';
import styles from './UpcomingEventsBlock.module.scss';
//#endregion

interface Props {
  events: EventDetails[];
  title: string;
  viewAllTo: string;
  emptyMessage?: string;
  emptyAction?: { label: ReactNode; onClick: () => void };
  limit?: number;
  isLoading?: boolean;
}

export const UpcomingEventsBlock: FC<Props> = ({
  events,
  title,
  viewAllTo,
  emptyMessage,
  emptyAction,
  limit,
  isLoading = false
}) => {
  const now = new Date();
  const upcoming = events
    .filter(e => new Date(e.startsAt) > now)
    .slice(0, limit);

  return (
    <div className={styles.eventBlock}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>

        <Link to={viewAllTo} className={styles.viewAllLink}>
          View all
        </Link>
      </div>

      {upcoming.length === 0 && emptyMessage ? (
        <EmptyBlock emptyMessage={emptyMessage} emptyAction={emptyAction} />
      ) : (
        <EventsList events={upcoming} isLoading={isLoading} />
      )}
    </div>
  );
};
