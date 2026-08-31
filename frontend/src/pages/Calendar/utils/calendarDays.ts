export interface CalendarDay {
  date: Date;
  span?: number;
}

export function getCalendarDays (
  year: number,
  month: number
): (CalendarDay | null)[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDayOfMonth.getDay();

  const days: (CalendarDay | null)[] = [];

  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ date: new Date(year, month, day) });
  }

  const remainder = days.length % 7;

  if (remainder !== 0) {
    const lastDay = days[days.length - 1];
    if (lastDay) {
      lastDay.span = 7 - remainder + 1;
    }
    days.length = days.length - remainder + 1;
  }

  return days;
}
