//#region imports
import { useParams } from 'react-router';
import { usePageTitle } from '../../hooks/usePageTitle';
import { ParticipantsTable } from './components/ParticipantsTable';
import { useParticipants } from './hooks/useParticipants';
import { useAuth } from '../../contexts/AuthContext';
import { ErrorPage } from '../ErrorPage';
import { EventNotFound } from '../EventNotFound';
import { useEvent } from '../EventPage/hooks/useEvent';
import {
  DataPageLayout,
  DataPageSkeleton
} from '../../components/layout/DataPageLayout';
//#endregion

export const EventParticipants = () => {
  const { id } = useParams<{ id: string }>();
  const { event, isLoading: eventLoading } = useEvent(id);
  const { participants, isLoading: participantsLoading } = useParticipants(
    Number(id)
  );
  const { user, isLoading: authLoading } = useAuth();
  const isLoading = eventLoading || authLoading;

  usePageTitle(event ? `Participants — ${event.title}` : 'Participants');

  if (isLoading) {
    return (
      <DataPageSkeleton
        backLink={{ to: `/events/${id}`, label: 'Back to event' }}
      >
        <ParticipantsTable participants={[]} isLoading={true} />
      </DataPageSkeleton>
    );
  }

  if (!event) {
    return <EventNotFound />;
  }

  if (event?.organizerId !== user?.id) {
    return (
      <ErrorPage
        type='access-denied'
        title='Access denied'
        subtitle="You don't have permission to view the participants."
        buttonText='Back to event'
        backTo={`/events/${event?.id}`}
      />
    );
  }

  return (
    <DataPageLayout
      title='Participants'
      subtitle={`${participants.length} people registered for ${event?.title}.`}
      backLink={{ to: `/events/${event?.id}`, label: 'Back to event' }}
    >
      <ParticipantsTable
        participants={participants}
        isLoading={participantsLoading}
      />
    </DataPageLayout>
  );
};
