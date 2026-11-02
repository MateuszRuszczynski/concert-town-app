//#region imports
import { useState, type FC } from 'react';
import type { EventDetails } from '../../../../../../types/events';
import { useNotification } from '../../../../../../contexts/NotificationContext';
import { getErrorMessage } from '../../../../../../utils/getErrorMessage';
import { ConfirmDialog } from '../../../ConfirmDialog';
import { CalendarX } from 'lucide-react';
import { Button } from '../../../../../../components/ui/Button';
import { useAllRegistrations, useCancelRegistration } from '../../../../../../api/queries/registrations';
import styles from "./AttendeeActions.module.scss";
//#endregion

interface Props {
  event: EventDetails;
}

export const AttendeeActions: FC<Props> = ({ event }) => {
  const { data } = useAllRegistrations();

  const cancelRegistration = useCancelRegistration();

  const { showToast } = useNotification();

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelRegistration = async () => {
    setIsCancelling(true);
    try {
      const currentRegistration = data?.registrations.find(r => r.event.id === event.id);

      if (!currentRegistration) {
        throw new Error('You were not registered for this event');
      }

      await cancelRegistration.mutateAsync(currentRegistration.id);
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
        description='You will lose your spot at this event. Cancellation is available only before the event starts.'
        confirmLabel={isCancelling ? "Canceling..." : "Cancel registration"}
        onConfirm={handleCancelRegistration}
        isLoading={isCancelling}
        isOpen={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      />
    </div>
  );
};
