//#region imports
import { useNotification } from '../../contexts/NotificationContext';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { OrganizerRequestsTable } from './components/OrganizerRequestsTable';
import { DataPageLayout } from '../../components/layout/DataPageLayout';
import {
  useAllOrganizerRequests,
  useDecideOrganizerRequest
} from '../../api/queries/organizerRequests';
import { QueryError } from '../../components/ui/QueryError';
//#endregion

export const OrganizerRequests = () => {
  const {
    data: requests = [],
    isLoading,
    isError,
    error
  } = useAllOrganizerRequests();
  const decide = useDecideOrganizerRequest();

  const { showToast } = useNotification();

  const handleDecision = async (id: number, decision: 'approve' | 'reject') => {
    try {
      await decide.mutateAsync({ id, decision });
      showToast(
        `Request ${decision === 'approve' ? 'approved' : 'rejected'}`,
        'success'
      );
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to process request.'), 'error');
    }
  };

  return (
    <DataPageLayout
      title='Organizer Requests'
      subtitle='Review pending organizer applications.'
    >
      {isError ? (
        <QueryError error={error} fallback='Failed to load requests.' />
      ) : (
        <OrganizerRequestsTable
          requests={requests}
          isLoading={isLoading}
          onApprove={id => handleDecision(id, 'approve')}
          onReject={id => handleDecision(id, 'reject')}
        />
      )}
    </DataPageLayout>
  );
};
