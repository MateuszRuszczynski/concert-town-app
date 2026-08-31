import type { FC } from "react";
import styles from "./FormError.module.scss";
import { capitalizeFirstWord } from "../../utils/capitalizeFirstWord";

interface Props {
  errorMessage: string;
}

export const FormError: FC<Props> = ({ errorMessage }) => (
  <p className={styles.errorMessage} aria-live='polite'>
    {capitalizeFirstWord(errorMessage)}
  </p>
);
