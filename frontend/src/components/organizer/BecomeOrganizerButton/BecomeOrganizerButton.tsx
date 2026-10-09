//#region imports
import { useState, type FC } from 'react';
import { useOrganizerRequests } from '../../../contexts/OrganizerContext/useOrganizerRequests';
import { useNotification } from '../../../contexts/NotificationContext';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { Button } from '../../ui/Button';
import styles from './BecomeOrganizerButton.module.scss';
//#endregion

type Props = {
  fitContent?: boolean;
};

export const BecomeOrganizerButton: FC<Props> = ({ fitContent = false }) => {
  const { submitRequest, myLatestStatus, isLoadingMine } =
    useOrganizerRequests();
  const { showToast } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    setIsSubmitting(true);

    try {
      await submitRequest();
      showToast('Your request has been submitted!', 'success');
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to submit request'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingMine) return null;

  if (myLatestStatus === 'pending') {
    return <span className={styles.pendingBadge}>Request pending review</span>;
  }

  if (myLatestStatus === 'rejected') {
    return (
      <Button
        onClick={handleClick}
        isLoading={isSubmitting}
        fitContent={fitContent}
      >
        Request again
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      isLoading={isSubmitting}
      fitContent={fitContent}
    >
      Become an organizer
    </Button>
  );
};
