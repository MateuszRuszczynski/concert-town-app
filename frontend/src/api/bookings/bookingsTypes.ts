import type { EventLocation } from '../../types/events';

export interface RegisteredEvent {
  id: number;
  title: string;
  starts_at: string;
  location: EventLocation;
  image: string | null;
  is_active: boolean;
}

export interface Bookings {
  id: number;
  event: RegisteredEvent;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface RegisterResponse {
  message: string;
  registration: Bookings;
}

export interface GetMyRegistrationsParams {
  ordering?: string;
  search?: string;
  page?: number;
}
