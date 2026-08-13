//#region imports
import { CheckCircle, X } from "lucide-react";
import { useEffect, type FC } from "react";
import styles from "./Toast.module.scss";
//#endregion

interface Props {
  message: string;
  onDismiss: () => void;
  duration?: number;
}

export const Toast: FC<Props> = ({ message, onDismiss, duration = 1500 }) => {
  useEffect(() => {
    const timeoutId = setTimeout(onDismiss, duration);
    return () => clearTimeout(timeoutId);
  }, [onDismiss, duration]);

  return (
    <div className={styles.toast} role='status'>
      <CheckCircle size={20} aria-hidden='true' />

      <span className={styles.message}>{message}</span>

      <button
        className={styles.dismissButton}
        onClick={onDismiss}
        aria-label='Dismiss'
      >
        <X size={15} aria-hidden='true' />
      </button>
    </div>
  );
};
