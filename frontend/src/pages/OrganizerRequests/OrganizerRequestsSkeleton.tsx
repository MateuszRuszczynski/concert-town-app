import { DataPageSkeleton } from '../../components/layout/DataPageLayout';
import { OrganizerRequestsTable } from './components/OrganizerRequestsTable';

export const OrganizerRequestsSkeleton = () => (
  <DataPageSkeleton>
    <OrganizerRequestsTable requests={[]} isLoading={true} />
  </DataPageSkeleton>
);
