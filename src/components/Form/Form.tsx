import type { FC, FormHTMLAttributes, ReactNode } from "react";
import styles from "./Form.module.scss";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
} 

export const Form:FC<Props> = ({ children, ...rest}) => (
  <form className={styles.form} {...rest}>
    {children}
  </form>
);
