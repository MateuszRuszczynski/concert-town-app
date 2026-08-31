//#region imports
import type { FC, ReactNode } from 'react';
import { PageHeader } from '../PageHeader/PageHeader';
import styles from './EventFormLayout.module.scss';
import { BackLink } from '../BackLink';
//#endregion

interface Props {
  title: string;
  subtitle: string;
  backTo: string;
  backLabel: string;
  children: ReactNode;
}

export const EventFormLayout: FC<Props> = ({
  title,
  subtitle,
  backLabel,
  backTo,
  children
}) => (
  <section className={styles.eventFormLayout}>
    <div className={styles.topBar}>
      <BackLink to={backTo} label={backLabel} />

      <PageHeader title={title} subtitle={subtitle} />
    </div>

    {children}
  </section>
);
