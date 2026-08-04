//#region imports
import type { FC, InputHTMLAttributes, ReactNode } from 'react';
import { Check } from 'lucide-react';
import styles from './FormField.module.scss';
//#endregion

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  errorMessage?: string;
  successMessage?: string;
  endAdornment?: ReactNode;
}

export const FormField: FC<Props> = ({
  label,
  id,
  errorMessage,
  successMessage,
  endAdornment,
  ...inputProps
}) => (
  <div className={styles.formfield}>
    <label htmlFor={id} className={styles.label}>
      {label}
    </label>

    <div className={styles.inputWrapper}>
      <input id={id} className={styles.fieldInput} {...inputProps} />
      {endAdornment && (
        <div className={styles.endAdornment}>{endAdornment}</div>
      )}
    </div>

    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

    {successMessage && (
      <p className={styles.successMessage}>
        <Check color='currentColor' size={16} />

        {successMessage}
      </p>
    )}
  </div>
);
