//#region imports
import type { FC } from 'react';
import type { EventDetails } from '../../../../types/events';
import baseStyles from './base.module.scss';
import styles from './EventHero.module.scss';
import { DEFAULT_EVENT_IMAGES } from '../../../../assets/defaultEventImages';
//#endregion

interface Props {
  event: EventDetails;
}

export const EventHero: FC<Props> = ({ event }) => (
  <div className={baseStyles.hero}>
    <img
      src={DEFAULT_EVENT_IMAGES[event.category.slug]}
      alt={event.title}
      className={styles.heroImage}
    />
  </div>
);
