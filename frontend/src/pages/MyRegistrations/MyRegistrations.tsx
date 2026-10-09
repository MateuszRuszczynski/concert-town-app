//#region imports
import { EmptyBlock } from '../../components/ui/EmptyBlock';
import {
  EventsPageLayout,
  EventsPageSkeleton
} from '../../components/EventsPageLayout';
import { useAuth } from '../../contexts/AuthContext';
import { ErrorPage } from '../ErrorPage';
import { useMyRegistationsFilters } from './hooks/useMyRegistrationsFilters';
import { useNavigate } from 'react-router';
//#endregion

export const MyRegistrations = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { events, isLoading, page, setPage, totalPages } =
    useMyRegistationsFilters();

  const navigate = useNavigate();

  if (authLoading) {
    return <EventsPageSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <ErrorPage
        type='access-denied'
        title='Sign in required'
        subtitle="Sign in to see the events you're registered to attend."
        buttonText='Go to sign in'
        backTo='/sign-in'
      />
    );
  }

  return (
    <EventsPageLayout
      title='My Registrations'
      subtitle="Events you're registered to attend."
      showNav={true}
      events={events}
      isLoading={isLoading}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      emptyState={
        <EmptyBlock
          emptyMessage="You haven't registered for any events yet."
          emptyAction={{
            label: 'Browse events',
            onClick: () => {
              navigate('/events');
            }
          }}
        />
      }
    />
  );
};
