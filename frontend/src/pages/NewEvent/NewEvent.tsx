//#region imports
import { usePageTitle } from '../../hooks/usePageTitle';
import { EventForm } from '../../components/events/EventForm';
import { EventFormLayout } from '../../components/layout/EventFormLayout';
//#endregion

export const NewEvent = () => {
  usePageTitle('New Event');

  return (
    <EventFormLayout
      title='Create a new event'
      subtitle='Fill in the details below to publish event.'
      backTo='/events'
      backLabel='Back to events'
    >
      <EventForm />
    </EventFormLayout>
  );
};
