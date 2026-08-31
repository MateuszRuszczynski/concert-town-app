//#region imports
import { useState, useCallback, type FC, type ReactNode } from 'react';
import { NotificationContext } from './NotificationContext';
import type { ToastData, ToastVariant } from '../../types/notification';
//#endregion

const AUTO_DISMISS_MS = 2000;

export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastData | null>(null);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), AUTO_DISMISS_MS);
  }, []);

  return (
    <NotificationContext.Provider value={{ toast, showToast, dismissToast }}>
      {children}
    </NotificationContext.Provider>
  );
};
