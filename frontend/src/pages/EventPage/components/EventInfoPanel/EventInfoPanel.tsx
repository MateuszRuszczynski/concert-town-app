//#region imports
import type { FC } from 'react';
import type { EventDetails } from '../../../../types/events';
import styles from './EventInfoPanel.module.scss';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  type LucideIcon
} from 'lucide-react';
import {
  formatEventDate,
  formatEventTime
} from '../../../../utils/dateFormatters';
//#endregion

interface Props {
  event: EventDetails;
}

interface InfoRowContent {
  primary: string;
  secondary?: string;
}

interface InfoRow {
  icon: LucideIcon;
  content: InfoRowContent;
}

export const EventInfoPanel: FC<Props> = ({ event }) => {
  const date = formatEventDate(event.startsAt);
  const startTime = formatEventTime(event.startsAt);
  const endTime = formatEventTime(event.endsAt);

  const infoRows: InfoRow[] = [
    { icon: CalendarDays, content: { primary: date } },
    { icon: Clock, content: { primary: `${startTime} - ${endTime}` } },
    {
      icon: MapPin,
      content:
        event.location === 'online'
          ? { primary: 'Online event' }
          : { primary: event.location.venue, secondary: event.location.city }
    },
    { icon: Users, content: { primary: `Hosted by ${event.host}` } }
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.price}>
        {event.price > 0 ? `$${event.price}` : 'Free'}
      </div>

      <div className={styles.mainInfo}>
        <ul className={styles.mainInfo}>
          {infoRows.map(({ icon: Icon, content }, index) => (
            <li key={index} className={styles.row}>
              <Icon size={16} aria-hidden='true' className={styles.rowIcon} />

              <div className={styles.rowContent}>
                <span className={styles.rowText}>{content.primary}</span>
                {content.secondary && <span>{content.secondary}</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
