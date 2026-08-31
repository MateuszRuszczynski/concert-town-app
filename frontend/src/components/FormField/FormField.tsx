//#region imports
import type { InputHTMLAttributes, ReactNode, FC } from "react";
import cn from "classNames";
import { Check } from "lucide-react";
import styles from "./FormField.module.scss";
//#endregion

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: ReactNode;
  errorMessage?: string;
  successMessage?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export const FormField: FC<Props> = ({
  label,
  id,
  errorMessage,
  successMessage,
  startAdornment,
  endAdornment,
  ...inputProps
}) => (
  <div className={styles.formfield}>
    {label && (
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    )}

    <div className={styles.inputWrapper}>
      {startAdornment && (
        <div className={styles.startAdornment}>{startAdornment}</div>
      )}

      <input
        id={id}
        className={cn(styles.fieldInput, {
          [styles.hasStartAdornment]: !!startAdornment,
          [styles.hasEndAdornment]: !!endAdornment
        })}
        {...inputProps}
      />

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
