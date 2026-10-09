//#region imports
import type { FC } from 'react';
import { EventsListSkeleton } from '../events/EventsList/EventsListSkeleton';
import { EventsNavSkeleton } from './components/EventsNav';
import { PageHeaderSkeleton } from '../ui/PageHeader/PageHeaderSkeleton';
import baseStyles from './base.module.scss';
//#endregion

interface Props {
  showNav?: boolean;
}

export const EventsPageSkeleton: FC<Props> = ({ showNav = false }) => (
  <div className={baseStyles.events}>
    {showNav && <EventsNavSkeleton />}

    <PageHeaderSkeleton />

    <EventsListSkeleton />
  </div>
);
