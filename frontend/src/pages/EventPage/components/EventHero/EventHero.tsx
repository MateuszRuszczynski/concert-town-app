//#region imports
import type { FC } from 'react';
import type { EventDetails } from '../../../../types/events';
import { CATEGORY_IMAGES } from '../../../../components/EventItem/categoriesImages';
import styles from './EventHero.module.scss';
//#endregion

interface Props {
  event: EventDetails;
}

export const EventHero: FC<Props> = ({ event }) => (
  <div className={styles.hero}>
    <img
      src={CATEGORY_IMAGES[event.category]}
      alt={event.title}
      className={styles.heroImage}
    />
  </div>
);
