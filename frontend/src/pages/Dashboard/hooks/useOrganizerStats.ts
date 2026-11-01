//#region imports
import { useAllMyEvents } from '../../../api/queries/events/useEventsQueries';
import type { StatItem } from '../types/statItem';
import { CalendarClock, Ticket, TrendingUp, Users } from 'lucide-react';
//#endregion

export function useOrganizerStats () {
  const { data: myAllEvents = []} = useAllMyEvents();
  const { data: myPublishedEvents = []} = useAllMyEvents('active');

  const totalEvents = myAllEvents.length;
  const publishedCount = myPublishedEvents.length;
  const upcomingEvents = myPublishedEvents.filter(
    event => new Date(event.startsAt) > new Date()
  ).length;
  const totalAttendees = myAllEvents.reduce(
    (acc, event) => acc + event.registeredCount,
    0
  );
  const fillRate = Math.round(
    totalEvents > 0 ? (totalAttendees / (totalEvents * 100)) * 100 : 0
  );

  const stats: StatItem[] = [
    {
      icon: Ticket,
      label: 'Total events',
      value: totalEvents,
      footer: `${publishedCount} published`
    },
    {
      icon: CalendarClock,
      label: 'Upcoming',
      value: upcomingEvents,
      footer: 'Scheduled ahead'
    },
    {
      icon: Users,
      label: 'Total attendees',
      value: totalAttendees,
      footer: 'Across all events'
    },
    {
      icon: TrendingUp,
      label: 'Fill rate',
      value: `${fillRate}%`,
      footer: 'Published capacity'
    }
  ];

  return stats;
}
