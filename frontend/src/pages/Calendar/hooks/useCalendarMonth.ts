import { useState, useMemo } from 'react';
import { getCalendarDays } from '../utils/calendarDays';

export function useCalendarMonth() {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthLabel = useMemo(
    () => new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate),
    [currentDate]
  );

  const days = useMemo(() => getCalendarDays(year, month), [year, month]);

  const goToPreviousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return { monthLabel, days, goToPreviousMonth, goToNextMonth };
}
