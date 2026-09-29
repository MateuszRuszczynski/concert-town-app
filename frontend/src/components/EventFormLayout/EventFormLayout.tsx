//#region imports
import type { FC, ReactNode } from 'react';
import cn from 'classNames';
import { PageHeader } from '../PageHeader/PageHeader';
import { BackLink } from '../BackLink';
import baseStyles from './base.module.scss';
import styles from './EventFormLayout.module.scss';
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
  <section className={cn(baseStyles.eventFormLayout, styles.eventFormLayout)}>
    <div className={baseStyles.topBar}>
      <BackLink to={backTo} label={backLabel} />

      <PageHeader title={title} subtitle={subtitle} />
    </div>

    {children}
  </section>
);
