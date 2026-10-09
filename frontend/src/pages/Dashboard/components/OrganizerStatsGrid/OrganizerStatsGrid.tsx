//#region imports
import { StatsGridLayout } from '../StatsGridLayout';
import { useOrganizerStats } from '../../hooks/useOrganizerStats';
//#endregion

export const OrganizerStatsGrid = () => {
  const organizerStats = useOrganizerStats();

  return <StatsGridLayout stats={organizerStats} />;
};
