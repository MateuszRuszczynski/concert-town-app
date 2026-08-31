import styles from "./CalendarWeekdays.module.scss";

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarWeekdays = () => (
  <div className={styles.weekdaysRow}>
    {WEEKDAYS.map((day) => (
      <span key={day} className={styles.weekday}>
        {day}
      </span>
    ))}
  </div>
);
