//#region imports
import { useMyEventsPage } from './hooks/useMyEventsPage';
import {
  EventsPageLayout
} from '../../components/EventsPageLayout';
import { useNavigate } from 'react-router';
import { EmptyBlock } from '../../components/ui/EmptyBlock';
//#endregion

export const MyEvents = () => {
  const { events, isLoading, page, totalPages, setPage, error } = useMyEventsPage();
  const navigate = useNavigate();

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
      error={error}
    />
  );
};
