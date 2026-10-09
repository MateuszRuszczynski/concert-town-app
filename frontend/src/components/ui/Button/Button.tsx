//#region imports
import cn from 'classNames';
import type { ButtonHTMLAttributes, ReactNode, FC } from 'react';
import baseStyles from './base.module.scss';
import styles from './Button.module.scss';
//#endregion

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  fitContent?: boolean;
  variant?: ButtonVariant;
}

export const Button: FC<Props> = ({
  children,
  isLoading = false,
  fitContent = false,
  variant = 'primary',
  ...rest
}) => (
  <button
    className={cn(baseStyles.button, styles.button, {
      [styles.loading]: isLoading,
      [baseStyles.fitContent]: fitContent,
      [styles.secondary]: variant === 'secondary',
      [styles.danger]: variant === 'danger',
      [styles.success]: variant === 'success',
    })}
    {...rest}
  >
    {children}
  </button>
);
