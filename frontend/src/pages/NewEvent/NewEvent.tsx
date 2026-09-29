//#region imports
import { usePageTitle } from '../../hooks/usePageTitle';
import { EventForm } from '../../components/EventForm';
import { EventFormLayout } from '../../components/EventFormLayout';
import { useAuth } from '../../contexts/AuthContext';
import { ErrorPage } from '../ErrorPage';
import { Button } from '../../components/Button';
import { EventFormLayoutSkeleton } from '../../components/EventFormLayout/EventFormLayoutSkeleton';
//#endregion

export const NewEvent = () => {
  const { isOrganizerOrAdmin, isAuthenticated, isLoading } = useAuth();

  usePageTitle('New Event');

  if (isLoading) {
    return (
      <EventFormLayoutSkeleton backTo='/events' backLabel='Back to events' />
    );
  }

  if (!isAuthenticated || !isOrganizerOrAdmin) {
    return (
      <ErrorPage
        type='access-denied'
        title='Organizer access required'
        subtitle='You need to be an organizer to create an event.'
        buttonText='Back to events'
        backTo='/events'
      >
        <Button onClick={() => {}}>Become an organizer</Button>
      </ErrorPage>
    );
  }

  return (
    <EventFormLayout
      title='Create a new event'
      subtitle='Fill in the details below to publish or save a draft event.'
      backTo='/events'
      backLabel='Back to events'
    >
      <EventForm />
    </EventFormLayout>
  );
};
