//#region imports
import type { FC } from 'react';
import cn from 'classNames';
import type { EventDetails } from '../../../../types/events';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Wifi,
  type LucideIcon
} from 'lucide-react';
import {
  formatEventDate,
  formatEventTime
} from '../../../../utils/dateFormatters';
import baseStyles from './base.module.scss';
import styles from './EventInfoPanel.module.scss';
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
  const startsAt = formatEventTime(event.startsAt);
  const endsAt = formatEventTime(event.endsAt);

  const infoRows: InfoRow[] = [
    { icon: CalendarDays, content: { primary: date } },
    { icon: Clock, content: { primary: `${startsAt} - ${endsAt}` } },
    {
      icon: event.location === 'online' ? Wifi : MapPin,
      content: event.location === 'online' ? { primary: 'Online event'} : { primary: event.location.venue, secondary: event.location.city }
    },
    { icon: Users, content: { primary: `Hosted by ${event.host}` } }
  ];

  return (
    <div className={baseStyles.panel}>
      <div className={cn(baseStyles.price, styles.price)}>
        {event.price > 0 ? `$${event.price}` : 'Free'}
      </div>

      <ul className={baseStyles.mainInfo}>
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
  );
};
