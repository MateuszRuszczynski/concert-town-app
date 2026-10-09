//#region imports
import cn from 'classNames';
import { useParams } from 'react-router';
import { EventHero } from './components/EventHero';
import { EventHeader } from './components/EventHeader';
import { EventDescription } from './components/EventDescription';
import { RegistrationProgress } from './components/RegistrationProgress';
import { EventInfoPanel } from './components/EventInfoPanel';
import { EventActions } from './components/EventActions';
import { usePageTitle } from '../../hooks/usePageTitle';
import { BackLink } from '../../components/ui/BackLink';
import { useEventRelation } from '../../hooks/useEventRelation';
import { EventNotFound } from '../EventNotFound';
import { useEvent } from './hooks/useEvent';
import { EventPageSkeleton } from './EventPageSkeleton';
import baseStyles from './base.module.scss';
import styles from './EventPage.module.scss';
import { useAuth } from '../../contexts/AuthContext';
//#endregion

export const EventPage = () => {
  const { id } = useParams<{ id: string }>();
  const { event, isLoading: eventLoading, refetch } = useEvent(id);
  const { isLoading: authLoading } = useAuth();
  const isLoading = eventLoading || authLoading;

  usePageTitle(event?.title || 'Event Not Found');

  const relation = useEventRelation(event || undefined);

  if (isLoading) return <EventPageSkeleton />;

  if (!event) {
    return <EventNotFound />;
  }

  return (
    <section className={cn(baseStyles.eventPage, styles.eventPage)}>
      <BackLink to='/events' label='Back to events' />

      <EventHero event={event} />

      <div className={baseStyles.contentGrid}>
        <div className={baseStyles.mainColumn}>
          <EventHeader event={event} />

          <EventDescription description={event.description} />

          <RegistrationProgress
            registeredCount={event.registeredCount}
            capacity={event.capacity}
          />
        </div>

        <div className={baseStyles.sideColumn}>
          <EventInfoPanel event={event} />

          <EventActions
            event={event}
            relation={relation}
            refetchEvent={refetch}
          />
        </div>
      </div>
    </section>
  );
};
