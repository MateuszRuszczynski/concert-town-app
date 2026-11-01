//#region imports
import { EmptyBlock } from '../../components/ui/EmptyBlock';
import {
  EventsPageLayout
} from '../../components/EventsPageLayout';
import { useMyRegistrationsPage } from './hooks/useMyRegistrationsPage';
import { useNavigate } from 'react-router';
//#endregion

export const MyRegistrations = () => {
  const { events, isLoading, page, setPage, totalPages, error } =
    useMyRegistrationsPage();

  const navigate = useNavigate();

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
      error={error}
    />
  );
};
