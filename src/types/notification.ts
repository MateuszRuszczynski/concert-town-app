export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastData {
  message: string;
  variant: ToastVariant;
}
