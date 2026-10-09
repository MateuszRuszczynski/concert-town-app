//#region imports
import { useAuth } from '../../contexts/AuthContext';
import { useOrganizerRequests } from '../../contexts/OrganizerContext/useOrganizerRequests';
import { ErrorPage } from '../ErrorPage';
import { MyOrganizerRequestsTable } from './components/MyOrganizerRequestsTable';
import { EmptyBlock } from '../../components/ui/EmptyBlock';
import {
  DataPageLayout,
  DataPageSkeleton
} from '../../components/layout/DataPageLayout';
//#endregion

export const MyOrganizerRequests = () => {
  const { myRequests, isLoadingMine } = useOrganizerRequests();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <DataPageSkeleton>
        <MyOrganizerRequestsTable requests={[]} isLoading={true} />
      </DataPageSkeleton>
    );
  }

  if (!isAuthenticated) {
    return (
      <ErrorPage
        type='access-denied'
        title='Sign in required'
        subtitle='Sign in to track your organizer requests.'
        buttonText='Go to sign in'
        backTo='/sign-in'
      />
    );
  }

  return (
    <DataPageLayout
      title='My Organizer Requests'
      subtitle='Track the status of your organizer applications.'
    >
      {user?.role === 'admin' ? (
        <EmptyBlock emptyMessage="As an admin, you don't need to request organizer access - you already have full permissions." />
      ) : (
        <MyOrganizerRequestsTable
          requests={myRequests}
          isLoading={isLoadingMine}
        />
      )}
    </DataPageLayout>
  );
};
