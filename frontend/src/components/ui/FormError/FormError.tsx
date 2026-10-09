//#region imports
import type { FC } from "react";
import { capitalizeFirstWord } from "../../../utils/capitalizeFirstWord";
import styles from "./FormError.module.scss";
//#endregion

interface Props {
  errorMessage: string;
}

export const FormError: FC<Props> = ({ errorMessage }) => (
  <p className={styles.errorMessage} aria-live='polite'>
    {capitalizeFirstWord(errorMessage)}
  </p>
);
