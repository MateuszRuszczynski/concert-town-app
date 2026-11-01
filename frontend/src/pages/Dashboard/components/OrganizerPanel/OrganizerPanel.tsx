//#region imports
import { useNavigate } from 'react-router';
import { OrganizerStatsGrid } from '../OrganizerStatsGrid';
import { UpcomingEventsBlock } from '../UpcomingEventsBlock';
import { Plus } from 'lucide-react';
import { PanelSkeleton } from '../PanelSkeleton';
import { useAllMyEvents } from '../../../../api/queries/events/useEventsQueries';
//#endregion

export const OrganizerPanel = () => {
  const { data: activeMyEvents = [], isLoading: isActiveEventsLoading } =
    useAllMyEvents('active');
  const { data: canceledEvents = [], isLoading: isCanceledEventsLoading } =
    useAllMyEvents('inactive');
  const isMyEventsLoading = isActiveEventsLoading || isCanceledEventsLoading;

  const navigate = useNavigate();

  if (isMyEventsLoading) {
    return <PanelSkeleton />;
  }

  return (
    <>
      <OrganizerStatsGrid />

      <UpcomingEventsBlock
        events={activeMyEvents}
        title='Upcoming events'
        viewAllTo='/events/mine'
        emptyMessage='No upcoming events yet.'
        emptyAction={{
          label: (
            <>
              <Plus size={16} />
              Create your first event
            </>
          ),
          onClick: () => navigate('/events/new')
        }}
        limit={4}
        isLoading={isMyEventsLoading}
      />

      {canceledEvents.length > 0 && (
        <UpcomingEventsBlock
          events={canceledEvents}
          title='Canceled events'
          viewAllTo='/events/mine'
          limit={4}
          isLoading={isMyEventsLoading}
        />
      )}
    </>
  );
};
