//#region imports
import { useState, type FC } from 'react';
import type { EventDetails } from '../../../../../../types/events';
import { useEvents } from '../../../../../../contexts/EventContext';
import { useNotification } from '../../../../../../contexts/NotificationContext';
import { getErrorMessage } from '../../../../../../utils/getErrorMessage';
import { CalendarCheck } from 'lucide-react';
import { Button } from '../../../../../../components/Button';
import styles from './VisitorActions.module.scss';
import { useAuth } from '../../../../../../contexts/AuthContext/useAuth';
import { Link } from 'react-router';
//#endregion

interface Props {
  event: EventDetails;
}

export const VisitorActions: FC<Props> = ({ event }) => {
  const { isAuthenticated } = useAuth();
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
      <Button
        onClick={handleRegister}
        isLoading={isRegistering}
        disabled={!isAuthenticated || isRegistering}
      >
        <CalendarCheck size={16} />

        {isRegistering ? 'Registering...' : 'Register'}
      </Button>

      {!isAuthenticated && (
        <p className={styles.signInHint}>
          <Link to="/sign-in" state={{ redirectTo: `/events/${event.id}` }} className={styles.signInLink}>
            Sign in
          </Link>{' '}
          to register
        </p>
      )}
    </div>
  );
};
