//#region imports
import type { FC, ReactNode } from 'react';
import { BackLink } from '../../ui/BackLink';
import { PageHeaderSkeleton } from '../../ui/PageHeader/PageHeaderSkeleton';
import baseStyles from './base.module.scss';
//#endregion

interface Props {
  backLink?: { to: string; label: string };
  children: ReactNode;
}

export const DataPageSkeleton:FC<Props> = ({ backLink, children }) => (
  <div className={baseStyles.page}>
    <div className={baseStyles.topBar}>
      {backLink && <BackLink to={backLink.to} label={backLink.label} />}

      <PageHeaderSkeleton />
    </div>

    {children}
  </div>
);
