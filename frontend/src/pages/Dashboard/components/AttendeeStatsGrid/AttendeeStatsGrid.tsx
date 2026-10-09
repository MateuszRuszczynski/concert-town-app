import { StatsGridLayout } from '../StatsGridLayout';
import { useAtendeeStats } from '../../hooks/useAtendeeStats';

export const AttendeeStatsGrid = () => {
  const atendeeStats = useAtendeeStats();

  return <StatsGridLayout stats={atendeeStats} />;
};
