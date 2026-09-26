import type { FC, ReactNode } from "react";
import styles from "./PageHeader.module.scss";

interface Props {
  title: string;
  subtitle: ReactNode;
};

export const PageHeader:FC<Props> = ({ title, subtitle }) => {
  return (
    <header className={styles.pageHeader}>
      <h1 className={styles.title}>{title}</h1>

      <p className={styles.subtitle}>{subtitle}</p>
    </header>
  );
};
