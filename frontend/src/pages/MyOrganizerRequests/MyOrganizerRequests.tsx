//#region imports
import { useAuth } from '../../contexts/AuthContext';
import { MyOrganizerRequestsTable } from './components/MyOrganizerRequestsTable';
import { EmptyBlock } from '../../components/ui/EmptyBlock';
import { DataPageLayout } from '../../components/layout/DataPageLayout';
import { useMyOrganizerRequests } from '../../api/queries/organizerRequests';
import { QueryError } from '../../components/ui/QueryError';
//#endregion

export const MyOrganizerRequests = () => {
  const { data: requests = [], isLoading, isError, error } = useMyOrganizerRequests();

  const { user } = useAuth();

  return (
    <DataPageLayout
      title='My Organizer Requests'
      subtitle='Track the status of your organizer applications.'
    >
      {user?.role === 'admin' ? (
        <EmptyBlock emptyMessage="As an admin, you don't need to request organizer access - you already have full permissions." />
      ) : isError ? <QueryError error={error} fallback='Failed to load requests.' /> : (
        <MyOrganizerRequestsTable
          requests={requests}
          isLoading={isLoading}
        />
      )}
    </DataPageLayout>
  );
};
