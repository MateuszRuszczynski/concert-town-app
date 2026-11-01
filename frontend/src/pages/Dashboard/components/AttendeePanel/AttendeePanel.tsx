//#region imports
import { useNavigate } from 'react-router';
import { AttendeeStatsGrid } from '../AttendeeStatsGrid';
import { UpcomingEventsBlock } from '../UpcomingEventsBlock';
import { Ticket } from 'lucide-react';
import { PanelSkeleton } from '../PanelSkeleton';
import { useAllRegistrations } from '../../../../api/queries/registrations';
import { QueryError } from '../../../../components/ui/QueryError';
//#endregion

export const AttendeePanel = () => {
  const { data , isLoading, isError, error } = useAllRegistrations();

  const navigate = useNavigate();

  if (isLoading) {
    return <PanelSkeleton />
  }

  if (isError) return <QueryError error={error} />;

  return (
    <>
      <AttendeeStatsGrid />

      <UpcomingEventsBlock
        events={data?.events ?? []}
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
