//#region imports
import { useState, type FC } from 'react';
import type { EventDetails } from '../../../../../../types/events';
import { useEvents } from '../../../../../../contexts/EventContext';
import { useNotification } from '../../../../../../contexts/NotificationContext';
import { getErrorMessage } from '../../../../../../utils/getErrorMessage';
import { ConfirmDialog } from '../../../../../../components/ConfirmDialog';
import { CalendarX } from 'lucide-react';
import { Button } from '../../../../../../components/Button';
import styles from "./AttendeeActions.module.scss";
//#endregion

interface Props {
  event: EventDetails;
}

export const AttendeeActions: FC<Props> = ({ event }) => {
  const { cancelRegistration } = useEvents();
  const { showToast } = useNotification();

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelRegistration = async () => {
    setIsCancelling(true);
    try {
      await cancelRegistration(event.id);
      showToast('Registration cancelled', 'cancel');
      setIsCancelDialogOpen(false);
    } catch (err) {
      showToast(
        getErrorMessage(err, 'Failed to cancel registration.'),
        'error'
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className={styles.actions}>
      <ConfirmDialog
        trigger={
          <Button variant='secondary'>
            <CalendarX size={16} aria-hidden='true' />
            Cancel registration
          </Button>
        }
        title='Cancel your registration?'
        description='You will lose your spot at this event.'
        confirmLabel={isCancelling ? "Canceling..." : "Cancel registration"}
        onConfirm={handleCancelRegistration}
        isLoading={isCancelling}
        isOpen={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      />
    </div>
  );
};
