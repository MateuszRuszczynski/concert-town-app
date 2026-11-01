//#region imports
import { useParams } from 'react-router';
import type { EventFormData } from '../../types/events';
import { useAuth } from '../../contexts/AuthContext';
import { ErrorPage } from '../ErrorPage';
import { EventNotFound } from '../EventNotFound';
import { EventForm } from '../../components/events/EventForm';
import { EventFormLayoutSkeleton } from '../../components/layout/EventFormLayout/EventFormLayoutSkeleton';
import { EventFormLayout } from '../../components/layout/EventFormLayout';
import { useEvent } from '../../api/queries/events/useEventsQueries';
//#endregion

export const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading: eventLoading } = useEvent(id);
  const { user, isLoading: authLoading } = useAuth();

  const isLoading = eventLoading || authLoading;

  if (isLoading) {
    return (
      <EventFormLayoutSkeleton
        backTo={`/events/${event?.id}`}
        backLabel='Back to event'
      />
    );
  }

  if (!event) {
    return <EventNotFound />;
  }

  if (event.organizerId !== user?.id && user?.role !== 'admin') {
    return (
      <ErrorPage
        type='access-denied'
        title='Access denied'
        subtitle={"You don't have permission to edit this event"}
        buttonText='Back to event'
        backTo={`/events/${event.id}`}
      />
    );
  }

  const formInitials: EventFormData = {
    title: event.title,
    description: event.description,
    categoryId: event.category?.id ?? 0,
    host: event.host,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    location: event.location,
    capacity: event.capacity,
    price: event.price,
    status: event.status
  };

  return (
    <EventFormLayout
      title='Edit event'
      subtitle={`Update the details for ${event.title}.`}
      backTo={`/events/${event.id}`}
      backLabel='Back to event'
    >
      <EventForm eventId={Number(id)} initialValues={formInitials} />
    </EventFormLayout>
  );
};
