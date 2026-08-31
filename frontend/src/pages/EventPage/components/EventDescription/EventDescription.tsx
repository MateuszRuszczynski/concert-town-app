import type { FC } from 'react';
import styles from './EventDescription.module.scss';

interface Props {
  description: string;
}

export const EventDescription: FC<Props> = ({ description }) => (
  <div className={styles.description}>
    {description}
  </div>
);
