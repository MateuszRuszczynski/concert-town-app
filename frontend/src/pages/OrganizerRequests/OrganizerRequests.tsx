//#region imports
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useOrganizerRequests } from '../../contexts/OrganizerContext/useOrganizerRequests';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { ErrorPage } from '../ErrorPage';
import { OrganizerRequestsTable } from './components/OrganizerRequestsTable';
import {
  DataPageLayout,
  DataPageSkeleton
} from '../../components/layout/DataPageLayout';
//#endregion

export const OrganizerRequests = () => {
  const { allRequests, isLoadingAll, decide } = useOrganizerRequests();
  const { showToast } = useNotification();
  const { isLoading: authLoading, isAuthenticated, user } = useAuth();

  if (authLoading) {
    return (
      <DataPageSkeleton>
        <OrganizerRequestsTable requests={[]} isLoading={true} />
      </DataPageSkeleton>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <ErrorPage
        type='access-denied'
        title='Admin access required'
        subtitle='This page is only available to administrators.'
        buttonText={isAuthenticated ? 'Back to Dashboard' : 'Back to events'}
        backTo={isAuthenticated ? '/dashboard' : '/events'}
      />
    );
  }

  const handleDecision = async (id: number, decision: 'approve' | 'reject') => {
    try {
      await decide(id, decision);
      showToast(
        `Request ${decision === 'approve' ? 'approved' : 'rejected'}`,
        'success'
      );
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to process request'), 'error');
    }
  };

  return (
    <DataPageLayout
      title='Organizer Requests'
      subtitle='Review pending organizer applications.'
    >
      <OrganizerRequestsTable
        requests={allRequests}
        isLoading={isLoadingAll}
        onApprove={id => handleDecision(id, 'approve')}
        onReject={id => handleDecision(id, 'reject')}
      />
    </DataPageLayout>
  );
};
