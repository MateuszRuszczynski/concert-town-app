//#region imports
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCalendarMonth } from './hooks/useCalendarMonth';
import { MonthNavigator } from './components/MonthNavigator';
import { CalendarWeekdays } from './components/CalendarWeekdays';
import { useMemo } from 'react';
import { groupEventsByDate } from './utils/groupEventsByDate';
import { CalendarGrid } from './components/CalendarGrid';
import { CalendarLegend } from './components/CalendarLegend';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { useAllEvents } from '../../api/queries/events/useEventsQueries';
import { FormError } from '../../components/ui/FormError';
import styles from './Calendar.module.scss';
//#endregion

export const Calendar = () => {
  usePageTitle('Calendar');

  const { user } = useAuth();
  const { data: events = [], isError } = useAllEvents();
  const { monthLabel, goToNextMonth, goToPreviousMonth, days } =
    useCalendarMonth();

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

      {isError && <FormError errorMessage='Could not load events.' />}

      {user && <CalendarLegend />}

      <div className={styles.calendarBody}>
        <CalendarWeekdays />
        <CalendarGrid days={days} eventsByDate={eventsByDate} />
      </div>
    </section>
  );
};
