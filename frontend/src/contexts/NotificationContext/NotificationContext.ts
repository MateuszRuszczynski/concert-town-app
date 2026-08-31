import { createContext } from 'react';
import type { ToastData, ToastVariant } from '../../types/notification';

export interface NotificationContextType {
  toast: ToastData | null;
  showToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);