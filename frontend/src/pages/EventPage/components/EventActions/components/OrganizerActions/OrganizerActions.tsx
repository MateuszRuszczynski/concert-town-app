//#region imports
import { useState, type FC } from "react";
import type { EventDetails } from "../../../../../../types/events";
import { useEvents } from "../../../../../../contexts/EventContext";
import { useNavigate } from "react-router";
import { useNotification } from "../../../../../../contexts/NotificationContext";
import { Button } from "../../../../../../components/Button";
import { Pencil, Trash2, Users } from "lucide-react";
import { ConfirmDialog } from "../../../../../../components/ConfirmDialog";
import { getErrorMessage } from "../../../../../../utils/getErrorMessage";
import styles from "./OrganizerActions.module.scss";
//#endregion

interface Props {
  event: EventDetails;
}

export const OrganizerActions: FC<Props> = ({ event }) => {
  const { deleteEvent } = useEvents();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEvent(event.id);
      showToast('Event deleted', 'cancel');
      navigate('/events');
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to delete event'), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.actions}>
      <Button onClick={() => navigate(`/events/${event.id}/edit`)}>
        <Pencil size={16} aria-hidden="true" />
        Edit event
      </Button>

      <Button variant="secondary" onClick={() => navigate(`/events/${event.id}/participants`)}>
        <Users size={16} aria-hidden="true" />
        View participants
      </Button>

      <ConfirmDialog
        trigger={<Button variant="danger"><Trash2 size={16} aria-hidden="true" />Delete event</Button>}
        title="Delete this event?"
        description="This action cannot be undone. All registrations will be cancelled."
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
};
