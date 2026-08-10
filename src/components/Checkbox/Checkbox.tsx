import type { FC, InputHTMLAttributes, ReactNode } from 'react';
import styles from './Checkbox.module.scss';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  errorMessage?: string;
}

export const Checkbox: FC<Props> = ({ checked, onChange, label, errorMessage, id, ...rest }) => (
  <div className={styles.field}>
    <div className={styles.control}>
      <input
        type="checkbox"
        id={id}
        className={styles.checkbox}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        {...rest}
      />
      <label htmlFor={id} className={styles.label}>{label}</label>
    </div>

    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
  </div>
);
