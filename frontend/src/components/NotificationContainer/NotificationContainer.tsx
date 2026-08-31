//#region imports
import { useNotification } from '../../contexts/NotificationContext';
import { Toast } from '../Toast';
import styles from './NotificationContainer.module.scss';
//#endregion

export const NotificationContainer = () => {
  const { toast, dismissToast } = useNotification();

  if (!toast) return null;

  return (
    <div className={styles.container}>
      <Toast
        message={toast.message}
        variant={toast.variant}
        onDismiss={dismissToast}
      />
    </div>
  );
};
