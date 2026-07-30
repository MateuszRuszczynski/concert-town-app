//#region imports
import cn from "classnames";
import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import styles from "./Button.module.scss";
//#endregion

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
}

export const Button:FC<Props> = ({ 
  children,
  isLoading = false,
  ...rest
}) => (
  <button className={cn(styles.button, {
    [styles.loading]: isLoading,
  })} {...rest}>
    {children}
  </button>
);
