import { createContext } from "react";
import type { Bookings } from "../../api/bookings/bookingsTypes";
import type { EventDetails } from "../../types/events";

export interface RegistrationsContextType {
  registrations: Bookings[];
  attendingEvents: EventDetails[];
  isLoading: boolean;
  error: string | null;
  register: (eventId: number) => Promise<void>;
  cancelRegistration: (eventId: number) => Promise<void>;
  refetchRegistrations: () => Promise<void>;
};

export const RegistrationsContext = createContext<RegistrationsContextType | undefined>(undefined);
