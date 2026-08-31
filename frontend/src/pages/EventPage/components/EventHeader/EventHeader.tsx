//#region imports
import type { FC } from 'react';
import type { EventDetails } from '../../../../types/events';
import { RelationBadge } from '../../../../components/RelationBadge';
import { CategoryBadge } from '../../../../components/CategoryBadge';
import styles from './EventHeader.module.scss';
//#endregion

interface Props {
  event: EventDetails;
}

export const EventHeader: FC<Props> = ({ event }) => (
  <div className={styles.header}>
    <div className={styles.metaRow}>
      {event.relation && <RelationBadge relation={event.relation} />}

      <CategoryBadge category={event.category} />
    </div>

    <h1 className={styles.title}>{event.title}</h1>
  </div>
);
