//#region imports
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import type { FC } from 'react';
import { Button } from '../Button/Button';
import styles from './ConfirmDialog.module.scss';
//#endregion

interface Props {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  isLoading?: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConfirmDialog: FC<Props> = ({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
  isLoading = false,
  isOpen,
  onOpenChange
}) => (
  <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
    <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>

    <AlertDialog.Portal>
      <AlertDialog.Overlay className={styles.overlay} />
      <AlertDialog.Content className={styles.content}>
        <AlertDialog.Title className={styles.title}>{title}</AlertDialog.Title>
        <AlertDialog.Description className={styles.description}>
          {description}
        </AlertDialog.Description>

        <div className={styles.actions}>
          <AlertDialog.Cancel asChild>
            <Button variant='secondary' fitContent disabled={isLoading}>
              Cancel
            </Button>
          </AlertDialog.Cancel>

          <Button
            variant='danger'
            fitContent
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);
