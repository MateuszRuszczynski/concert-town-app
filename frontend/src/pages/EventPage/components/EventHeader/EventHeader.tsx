//#region imports
import type { FC } from 'react';
import cn from 'classNames';
import type { EventDetails } from '../../../../types/events';
import { RelationBadge } from '../../../../components/events/RelationBadge';
import { CategoryBadge } from '../../../../components/events/CategoryBadge';
import { useEventRelation } from '../../../../hooks/useEventRelation';
import { CanceledBadge } from '../../../../components/events/CanceledBadge';
import baseStyles from './base.module.scss';
import styles from './EventHeader.module.scss';
//#endregion

interface Props {
  event: EventDetails;
}

export const EventHeader: FC<Props> = ({ event }) => {
  const relation = useEventRelation(event);

  return (
    <div className={cn(baseStyles.header, styles.header)}>
      <div className={styles.metaRow}>
        {event.status === "canceled" && (<CanceledBadge />)}
        {relation && <RelationBadge relation={relation} />}

        <CategoryBadge category={event.category?.name || null} />
      </div>

      <h1 className={styles.title}>{event.title}</h1>
    </div>
  );
};
