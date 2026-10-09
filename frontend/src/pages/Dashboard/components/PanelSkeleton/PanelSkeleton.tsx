import { EventsListSkeleton } from '../../../../components/events/EventsList/EventsListSkeleton';
import { StatsGridSkeleton } from '../StatsGridLayout/StatsGridSkeleton';

export const PanelSkeleton = () => (
  <>
    <StatsGridSkeleton />

    <EventsListSkeleton />
  </>
)
