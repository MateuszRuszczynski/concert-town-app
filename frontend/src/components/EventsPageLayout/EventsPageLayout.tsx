//#region imports
import type { FC, ReactNode } from 'react';
import cn from 'classNames';
import type { EventDetails } from '../../types/events';
import { EventsNav } from './components/EventsNav';
import { EventsList } from '../events/EventsList';
import { Pagination } from './components/Pagination';
import { PageHeader } from '../ui/PageHeader';
import baseStyles from './base.module.scss';
import styles from './EventsPageLayout.module.scss';
//#endregion

interface Props {
  title: string;
  subtitle: string;
  showNav?: boolean;
  toolbar?: ReactNode;
  events: EventDetails[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  emptyState?: ReactNode,
}

export const EventsPageLayout: FC<Props> = ({
  title,
  subtitle,
  showNav = false,
  toolbar,
  events,
  isLoading,
  page,
  totalPages,
  onPageChange,
  emptyState,
}) => (
  <section className={cn(baseStyles.events, styles.events)}>
    {showNav && <EventsNav />}

    <PageHeader title={title} subtitle={subtitle} />

    {toolbar && <div className={styles.toolbar}>{toolbar}</div>}

    <EventsList
      events={events}
      isLoading={isLoading}
      emptyState={emptyState}
    />

    {!isLoading && totalPages > 1 && (
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    )}
  </section>
);
