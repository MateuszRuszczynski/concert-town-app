//#region imports
import { usePageTitle } from '../../hooks/usePageTitle';
import { useAuth } from '../../contexts/AuthContext';
import { ErrorPage } from '../ErrorPage';
import { BecomeOrganizerButton } from '../../components/organizer/BecomeOrganizerButton';
import { EventForm } from '../../components/events/EventForm';
import { EventFormLayoutSkeleton } from '../../components/layout/EventFormLayout/EventFormLayoutSkeleton';
import { EventFormLayout } from '../../components/layout/EventFormLayout';
//#endregion

export const NewEvent = () => {
  const { isOrganizerOrAdmin, isAuthenticated, isLoading } = useAuth();

  usePageTitle('New Event');

  if (isLoading) {
    return (
      <EventFormLayoutSkeleton backTo='/events' backLabel='Back to events' />
    );
  }

  if (!isAuthenticated) {
    return (
      <ErrorPage
        type='access-denied'
        title='Sign in required'
        subtitle='Sign in to create an event.'
        buttonText='Go to sign in'
        backTo='/sign-in'
      />
    );
  }

  if (!isOrganizerOrAdmin) {
    return (
      <ErrorPage
        type='access-denied'
        title='Organizer access required'
        subtitle='You need to be an organizer to create an event.'
        buttonText='Back to events'
        backTo='/events'
      >
        <BecomeOrganizerButton />
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
