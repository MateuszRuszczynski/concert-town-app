//#region imports
import { useMyEventFilters } from './hooks/useMyEventFilters';
import { useAuth } from '../../contexts/AuthContext';
import { ErrorPage } from '../ErrorPage';
import {
  EventsPageLayout,
  EventsPageSkeleton
} from '../../components/EventsPageLayout';
import { useNavigate } from 'react-router';
import { EmptyBlock } from '../../components/ui/EmptyBlock';
import { BecomeOrganizerButton } from '../../components/organizer/BecomeOrganizerButton';
//#endregion

export const MyEvents = () => {
  const {
    isAuthenticated,
    isLoading: authLoading,
    isOrganizerOrAdmin
  } = useAuth();
  const { events, isLoading, page, totalPages, setPage } = useMyEventFilters();
  const navigate = useNavigate();

  if (authLoading) {
    return <EventsPageSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <ErrorPage
        type='access-denied'
        title='Sign in required'
        subtitle='Sign in to manage and track your events.'
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
        subtitle='Only organizers can manage events.'
        buttonText='Back to events'
        backTo='/events'
      >
        <BecomeOrganizerButton />
      </ErrorPage>
    );
  }

  return (
    <EventsPageLayout
      title='My Events'
      subtitle='Manage and track all of your events.'
      showNav={true}
      events={events}
      isLoading={isLoading}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      emptyState={
        <EmptyBlock
          emptyMessage="You haven't created any events yet."
          emptyAction={{
            label: 'Create your first event',
            onClick: () => {
              navigate('/events/new');
            }
          }}
        />
      }
    />
  );
};
