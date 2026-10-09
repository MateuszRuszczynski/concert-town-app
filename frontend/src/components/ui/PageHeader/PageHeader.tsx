//#region imports
import type { FC, ReactNode } from "react";
import baseStyles from './base.module.scss';
import styles from "./PageHeader.module.scss";
//#endregion

interface Props {
  title: string;
  subtitle: ReactNode;
};

export const PageHeader:FC<Props> = ({ title, subtitle }) => {
  return (
    <header className={baseStyles.pageHeader}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.subtitle}>{subtitle}</div>
    </header>
  );
};
