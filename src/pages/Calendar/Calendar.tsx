//#region imports
import { PageHeader } from '../../components/PageHeader';
import { useEvents } from '../../contexts/EventContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCalendarMonth } from './hooks/useCalendarMonth';
import styles from './Calendar.module.scss';
import { MonthNavigator } from './components/MonthNavigator';
import { CalendarWeekdays } from './components/CalendarWeekdays';
import { useMemo } from 'react';
import { groupEventsByDate } from './utils/groupEventsByDate';
import { CalendarGrid } from './components/CalendarGrid';
//#endregion

export const Calendar = () => {
  usePageTitle('Calendar');

  const { events } = useEvents();
  const { monthLabel, goToNextMonth, goToPreviousMonth, days } = useCalendarMonth();

  const eventsByDate = useMemo(() => groupEventsByDate(events), [events]);

  return (
    <section className={styles.calendar}>
      <div className={styles.headerRow}>
        <PageHeader
          title='Calendar'
          subtitle='A monthly view of your scheduled events.'
        />

        <MonthNavigator
          monthLabel={monthLabel}
          onNext={goToNextMonth}
          onPrevious={goToPreviousMonth}
        />
      </div>

      <div className={styles.calendarBody}>
        <CalendarWeekdays />
        <CalendarGrid days={days} eventsByDate={eventsByDate} />
      </div>
    </section>
  );
};
