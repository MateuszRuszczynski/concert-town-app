//#region imports
import { useNavigate } from 'react-router';
import { useEvents } from '../../../../contexts/EventContext';
import { OrganizerStatsGrid } from '../OrganizerStatsGrid';
import { UpcomingEventsBlock } from '../UpcomingEventsBlock';
import { Plus } from 'lucide-react';
import { PanelSkeleton } from '../PanelSkeleton';
//#endregion

export const OrganizerPanel = () => {
  const { activeMyEvents, drafts, isMyEventsLoading } = useEvents();
  const navigate = useNavigate();

  if (isMyEventsLoading) {
    return <PanelSkeleton />
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
        limit={3}
        isLoading={isMyEventsLoading}
      />

      {drafts.length > 0 && (
        <UpcomingEventsBlock
          events={drafts}
          title='Drafts'
          viewAllTo='/events/mine?status=draft'
          limit={3}
          isLoading={isMyEventsLoading}
        />
      )}
    </>
  );
};
