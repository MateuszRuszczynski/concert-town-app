import { createContext } from 'react';
import type { EventDetails, EventFormData } from '../../types/events';

export interface EventsContextType {
  events: EventDetails[];
  eventsCount: number;
  myEvents: EventDetails[];
  drafts: EventDetails[];
  activeMyEvents: EventDetails[];
  isLoading: boolean;
  error: string | null;
  isMyEventsLoading: boolean;
  addEvent: (data: EventFormData) => Promise<void>;
  updateEvent: (id: number, data: Partial<EventFormData>) => Promise<void>;
  deleteEvent: (eventId: number, organizerId: number) => Promise<void>;
  refetchEvents: () => Promise<void>;
}

export const EventsContext = createContext<EventsContextType | undefined>(
  undefined
);
