//#region imports
import type { FC } from 'react';
import type { EventDetails } from '../../../../types/events';
import { DEFAULT_EVENT_IMAGES } from '../../../../assets/defaultEventImages';
import baseStyles from './base.module.scss';
import styles from './EventHero.module.scss';
//#endregion

interface Props {
  event: EventDetails;
}

export const EventHero: FC<Props> = ({ event }) => (
  <div className={baseStyles.hero}>
    <img
      src={
        event.image ??
        DEFAULT_EVENT_IMAGES[event.category?.slug ?? ''] ??
        DEFAULT_EVENT_IMAGES.default
      }
      alt={event.title}
      className={styles.heroImage}
    />
  </div>
);
