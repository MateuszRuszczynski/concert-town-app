//#region imports
import type { FC } from 'react';
import { BackLink } from '../../ui/BackLink';
import { EventFormSkeleton } from '../../events/EventForm';
import { PageHeaderSkeleton } from '../../ui/PageHeader/PageHeaderSkeleton';
import baseStyles from './base.module.scss';
//#endregion

interface Props {
  backTo: string;
  backLabel: string;
}

export const EventFormLayoutSkeleton:FC<Props> = ({
  backTo,
  backLabel
}) => (
  <div className={baseStyles.eventFormLayout}>
    <div className={baseStyles.topBar}>
      <BackLink to={backTo} label={backLabel} />

      <PageHeaderSkeleton />
    </div>

    <EventFormSkeleton />
  </div>
);
