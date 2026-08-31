//#region imports
import { useParams } from 'react-router';
import { useEvents } from '../../contexts/EventContext';
import type { EventFormData } from '../../types/events';
import { EventForm } from '../../components/EventForm';
import { EventNotFound } from '../EventPage/components/EventNotFound';
import { EventFormLayout } from '../../components/EventFormLayout';
//#endregion

export const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const { events } = useEvents();

  const event = events.find(e => e.id === id);

  if (!event) {
    return <EventNotFound />;
  }

  const formInitials: EventFormData = {
    title: event.title,
    description: event.description,
    category: event.category,
    host: event.host,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    location: event.location,
    capacity: event.capacity,
    price: event.price
  };

  return (
    <EventFormLayout
      title='Edit event'
      subtitle={`Update the details for ${event.title}.`}
      backTo={`/events/${event.id}`}
      backLabel='Back to event'
    >
      <EventForm eventId={id} initialValues={formInitials} />
    </EventFormLayout>
  );
};
