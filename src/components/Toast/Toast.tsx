//#region imports
import type { FC } from 'react';
import cn from 'classNames';
import { CheckCircle, XCircle, Info, X, type LucideIcon, Ban } from 'lucide-react';
import type { ToastVariant } from '../../types/notification';
import styles from './Toast.module.scss';
//#endregion

interface Props {
  message: string;
  variant: ToastVariant;
  onDismiss: () => void;
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: LucideIcon; className: string }
> = {
  success: { icon: CheckCircle, className: styles.success },
  error: { icon: Ban, className: styles.error },
  cancel: { icon: XCircle, className: styles.cancel },
  info: { icon: Info, className: styles.info }
};

export const Toast: FC<Props> = ({ message, variant, onDismiss }) => {
  const { icon: Icon, className } = VARIANT_CONFIG[variant];

  return (
    <div className={cn(styles.toast, className)} role='status'>
      <Icon size={18} aria-hidden='true' />
      <span className={styles.message}>{message}</span>
      <button
        type='button'
        className={styles.dismissButton}
        onClick={onDismiss}
        aria-label='Dismiss'
      >
        <X size={14} aria-hidden='true' />
      </button>
    </div>
  );
};
