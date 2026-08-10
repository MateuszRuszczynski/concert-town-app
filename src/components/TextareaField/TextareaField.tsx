//#region imports
import type { FC, TextareaHTMLAttributes } from 'react';
import styles from './TextareaField.module.scss';
import cn from 'classnames';
//#endregion

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  errorMessage?: string;
}

export const TextareaField: FC<Props> = ({
  label,
  id,
  errorMessage,
  className,
  ...rest
}) => (
  <div className={styles.field}>
    <label htmlFor={id} className={styles.label}>
      {label}
    </label>
    <textarea id={id} className={cn(styles.textarea, className)} {...rest} />
    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
  </div>
);
