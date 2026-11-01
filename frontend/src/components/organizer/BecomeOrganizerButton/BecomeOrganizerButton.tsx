//#region imports
import { type FC } from 'react';
import { useNotification } from '../../../contexts/NotificationContext';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { Button } from '../../ui/Button';
import styles from './BecomeOrganizerButton.module.scss';
import {
  useMyLatestRequestStatus,
  useSubmitOrganizerRequest
} from '../../../api/queries/organizerRequests';
//#endregion

interface Props {
  fitContent?: boolean;
}

export const BecomeOrganizerButton: FC<Props> = ({ fitContent = false }) => {
  const submitRequest = useSubmitOrganizerRequest();
  const myLatestStatus = useMyLatestRequestStatus();

  const { showToast } = useNotification();

  const handleClick = async () => {
    try {
      await submitRequest.mutateAsync();
      showToast('Your request has been submitted!', 'success');
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to submit request'), 'error');
    }
  };

  if (myLatestStatus === 'pending') {
    return <span className={styles.pendingBadge}>Request pending review</span>;
  }

  if (myLatestStatus === 'rejected') {
    return (
      <Button
        onClick={handleClick}
        isLoading={submitRequest.isPending}
        fitContent={fitContent}
      >
        Request again
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      isLoading={submitRequest.isPending}
      fitContent={fitContent}
    >
      Become an organizer
    </Button>
  );
};
