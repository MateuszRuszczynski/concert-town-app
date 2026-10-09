//#region imports
import type { FC, ReactNode } from 'react';
import cn from 'classNames';
import { BackLink } from '../../ui/BackLink';
import { PageHeader } from '../../ui/PageHeader';
import baseStyles from './base.module.scss';
import styles from './DataPageLayout.module.scss';
//#endregion

interface Props {
  title: string;
  subtitle: ReactNode;
  backLink?: { to: string; label: string };
  children: ReactNode;
}

export const DataPageLayout: FC<Props> = ({
  title,
  subtitle,
  backLink,
  children
}) => (
  <section className={cn(baseStyles.page, styles.page)}>
    <div className={baseStyles.topBar}>
      {backLink && <BackLink to={backLink.to} label={backLink.label} />}

      <PageHeader title={title} subtitle={subtitle} />
    </div>

    {children}
  </section>
);
