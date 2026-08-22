//#region imports
import { usePageTitle } from '../../hooks/usePageTitle';
import { EventForm } from '../../components/EventForm';
import { EventFormLayout } from '../../components/EventFormLayout';
//#endregion

export const NewEvent = () => {
  usePageTitle('New Event');

  return (
    <EventFormLayout
      title="Create a new event"
      subtitle="Fill in the details below to publish or save a draft event."
      backTo='/events'
      backLabel='Back to events'
    >
      <EventForm />
    </EventFormLayout>
  );
};
