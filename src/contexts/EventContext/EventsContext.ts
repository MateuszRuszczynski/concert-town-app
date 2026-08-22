import { createContext } from 'react';
import type { EventDetails, EventFormData } from '../../types/events';

export interface EventsContextType {
  events: EventDetails[];
  isLoading: boolean;
  error: string | null;
  addEvent: (data: EventFormData) => Promise<void>;
  updateEvent: (id: string, data: Partial<EventFormData>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  registerForEvent: (id: string) => Promise<void>;
  cancelRegistration: (id: string) => Promise<void>;
  refetchEvents: () => Promise<void>;
}

export const EventsContext = createContext<EventsContextType | undefined>(
  undefined
);
