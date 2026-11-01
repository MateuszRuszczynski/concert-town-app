//#region imports
import { useState, type FC } from 'react';
import type { EventDetails } from '../../../../../../types/events';
import { useNavigate } from 'react-router';
import { useNotification } from '../../../../../../contexts/NotificationContext';
import { Button } from '../../../../../../components/ui/Button';
import { Pencil, Trash2, Users } from 'lucide-react';
import { ConfirmDialog } from '../../../ConfirmDialog';
import { getErrorMessage } from '../../../../../../utils/getErrorMessage';
import { useDeleteEvent } from '../../../../../../api/queries/events/useEventMutations';
import styles from './OrganizerActions.module.scss';
//#endregion

interface Props {
  event: EventDetails;
}

export const OrganizerActions: FC<Props> = ({ event }) => {
  const deleteEvent = useDeleteEvent();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteEvent.mutateAsync(event.id);
      showToast('Event deleted', 'cancel');
      navigate('/events');
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to delete event'), 'error');
    }
  };

  return (
    <div className={styles.actions}>
      <Button onClick={() => navigate(`/events/${event.id}/edit`)}>
        <Pencil size={16} aria-hidden='true' />
        Edit event
      </Button>

      <Button
        variant='secondary'
        onClick={() => navigate(`/events/${event.id}/participants`)}
      >
        <Users size={16} aria-hidden='true' />
        View participants
      </Button>

      <ConfirmDialog
        trigger={
          <Button variant='danger'>
            <Trash2 size={16} aria-hidden='true' />
            Cancel event
          </Button>
        }
        title='Delete this event?'
        description='This action cannot be undone. All registrations will be cancelled.'
        confirmLabel={deleteEvent.isPending ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        isLoading={deleteEvent.isPending}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
};
