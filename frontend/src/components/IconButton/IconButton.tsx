import type { ButtonHTMLAttributes, ReactNode, FC } from "react";
import styles from "./IconButton.module.scss";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const IconButton: FC<Props> = ({
  children,
  type = 'button',
  ...rest
}) => (
  <button className={styles.iconButton} type={type} {...rest}>
    {children}
  </button>
);
