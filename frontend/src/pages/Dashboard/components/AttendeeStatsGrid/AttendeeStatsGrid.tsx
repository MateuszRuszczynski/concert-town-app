import { StatsGridLayout } from '../StatsGridLayout';
import { useAttendeeStats } from '../../hooks/useAttendeeStats';

export const AttendeeStatsGrid = () => {
  const atendeeStats = useAttendeeStats();

  return <StatsGridLayout stats={atendeeStats} />;
};
