//#region imports
import { useState, type FC } from 'react';
import type { EventDetails } from '../../../../../../types/events';
import { useEvents } from '../../../../../../contexts/EventContext';
import { useNotification } from '../../../../../../contexts/NotificationContext';
import { getErrorMessage } from '../../../../../../utils/getErrorMessage';
import { CalendarCheck } from 'lucide-react';
import { Button } from '../../../../../../components/Button';
import styles from './VisitorActions.module.scss';
//#endregion

interface Props {
  event: EventDetails;
}

export const VisitorActions: FC<Props> = ({ event }) => {
  const { registerForEvent } = useEvents();
  const { showToast } = useNotification();

  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await registerForEvent(event.id);
      showToast('You have registered for this event!', 'success');
    } catch (err) {
      showToast(
        getErrorMessage(err, 'Failed to register. Please try again.'),
        'error'
      );
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className={styles.actions}>
      <Button onClick={handleRegister} isLoading={isRegistering}>
        <CalendarCheck size={16} />

        {isRegistering ? 'Registering...' : 'Register'}
      </Button>
    </div>
  );
};
