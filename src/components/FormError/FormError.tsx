import type { FC } from "react";
import styles from "./FormError.module.scss";

interface Props {
  errorMessage: string;
}

export const FormError:FC<Props> = ({ errorMessage }) => (
  <p className={styles.errorMessage}>
    {errorMessage}
  </p>
);
