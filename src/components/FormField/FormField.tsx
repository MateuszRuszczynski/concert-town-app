import type { FC, InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import styles from './FormField.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  errorMessage?: string;
  successMessage?: string;
}

export const FormField: FC<Props> = ({
  label,
  id,
  errorMessage,
  successMessage,
  ...inputProps
}) => (
  <div className={styles.formfield}>
    <label htmlFor={id} className={styles.label}>
      {label}
    </label>

    <input id={id} className={styles.fieldInput} {...inputProps} />

    {errorMessage && (
      <p className={styles.errorMessage}>{errorMessage}</p>
    )}

    {successMessage && (
      <p className={styles.successMessage}>
        <Check color='currentColor' size={16} />

         {successMessage}
      </p>
    )}
  </div>
);
