export type ToastVariant = 'success' | 'error' | 'cancel' | 'info';

export interface ToastData {
  message: string;
  variant: ToastVariant;
}
