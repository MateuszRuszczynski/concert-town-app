//#region imports
import { useState, type FC } from 'react';
import type { EventDetails } from '../../../../../../types/events';
import { useNotification } from '../../../../../../contexts/NotificationContext';
import { getErrorMessage } from '../../../../../../utils/getErrorMessage';
import { CalendarCheck } from 'lucide-react';
import { Button } from '../../../../../../components/ui/Button';
import { useAuth } from '../../../../../../contexts/AuthContext';
import { Link } from 'react-router';
import { useRegistrations } from '../../../../../../contexts/RegistrationsContext';
import styles from './VisitorActions.module.scss';
//#endregion

interface Props {
  event: EventDetails;
  refetchEvent: () => Promise<void>;
}

export const VisitorActions: FC<Props> = ({ event, refetchEvent }) => {
  const { isAuthenticated } = useAuth();
  const { register } = useRegistrations();
  const { showToast } = useNotification();

  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await register(event.id);
      await refetchEvent();
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
