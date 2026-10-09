//#region imports
import { useNavigate } from 'react-router';
import { useRegistrations } from '../../../../contexts/RegistrationsContext';
import { AttendeeStatsGrid } from '../AttendeeStatsGrid/AttendeeStatsGrid';
import { UpcomingEventsBlock } from '../UpcomingEventsBlock';
import { Ticket } from 'lucide-react';
import { useEvents } from '../../../../contexts/EventContext';
import { PanelSkeleton } from '../PanelSkeleton';
//#endregion

export const AttendeePanel = () => {
  const { isLoading: eventsLoading } = useEvents();
  const { attendingEvents, isLoading: registrationsLoading } = useRegistrations();
  const navigate = useNavigate();

  const isLoading = eventsLoading || registrationsLoading;

  if (isLoading) {
    return <PanelSkeleton />
  }

  return (
    <>
      <AttendeeStatsGrid />

      <UpcomingEventsBlock
        events={attendingEvents}
        title="Events you're attending"
        viewAllTo='/events/my-registrations'
        emptyMessage='Browse events to find something to attend!'
        emptyAction={{
          label: (
            <>
              <Ticket size={16} />
              Go to events page
            </>
          ),
          onClick: () => navigate('/events')
        }}
        limit={6}
      />
    </>
  );
};
