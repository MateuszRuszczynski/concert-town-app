//#region imports
import { useRegistrations } from '../../../contexts/RegistrationsContext';
import type { StatItem } from '../types/statItem';
import { CalendarCheck, Clock, DollarSign, History } from 'lucide-react';
//#endregion

export function useAtendeeStats () {
  const { attendingEvents } = useRegistrations();

  const totalRegistrations = attendingEvents.length;
  const upcomingEvents = attendingEvents.filter(
    event => new Date(event.startsAt) > new Date()
  ).length;
  const pastEvents = attendingEvents.filter(
    e => new Date(e.startsAt) <= new Date()
  ).length;
  const totalSpent = Math.round(
    attendingEvents.reduce((sum, e) => sum + Number(e.price), 0)
  );

  const stats: StatItem[] = [
    {
      icon: CalendarCheck,
      label: 'Total registrations',
      value: totalRegistrations,
      footer: 'All time'
    },
    {
      icon: Clock,
      label: 'Upcoming',
      value: upcomingEvents,
      footer: 'Events ahead'
    },
    {
      icon: History,
      label: 'Attended',
      value: pastEvents,
      footer: 'Past events'
    },
    {
      icon: DollarSign,
      label: 'Total spent',
      value: `$${totalSpent}`,
      footer: 'On tickets'
    }
  ];

  return stats;
}
