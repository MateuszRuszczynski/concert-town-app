//#region imports
import cn from 'classNames';
import type { ButtonHTMLAttributes, ReactNode, FC } from 'react';
import styles from './Button.module.scss';
//#endregion

type ButtonVariant = 'primary' | 'secondary';

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
    className={cn(styles.button, {
      [styles.loading]: isLoading,
      [styles.fitContent]: fitContent,
      [styles.secondary]: variant === 'secondary'
    })}
    {...rest}
  >
    {children}
  </button>
);
