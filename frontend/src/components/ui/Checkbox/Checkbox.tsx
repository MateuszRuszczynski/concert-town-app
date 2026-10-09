//#region imports
import type { InputHTMLAttributes, ReactNode, FC } from 'react';
import cn from 'classNames';
import baseStyles from './base.module.scss';
import styles from './Checkbox.module.scss';
//#endregion

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  errorMessage?: string;
}

export const Checkbox: FC<Props> = ({
  checked,
  onChange,
  label,
  errorMessage,
  id,
  ...rest
}) => (
  <div className={styles.field}>
    <div className={baseStyles.control}>
      <input
        type='checkbox'
        id={id}
        className={cn(baseStyles.checkbox, styles.checkbox)}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        {...rest}
      />
      <label htmlFor={id} className={baseStyles.label}>
        {label}
      </label>
    </div>

    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
  </div>
);
