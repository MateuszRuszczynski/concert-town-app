import type { FC, ReactNode } from "react";
import styles from "./EventFormSection.module.scss";

interface Props {
  title: string;
  children: ReactNode;
}

export const EventFormSection: FC<Props> = ({ title, children }) => (
  <fieldset className={styles.section}>
    <legend className={styles.sectionTitle}>{title}</legend>

    <div className={styles.sectionFields}>{children}</div>
  </fieldset>
);
