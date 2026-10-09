import type { Category, EventLocation } from "../../types/events";

export interface EventResponse {
  id: number;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  host: string;
  location: EventLocation;
  category: Category;
  category_id: number;
  price: number;
  total_seats: number;
  available_seats: number;
  is_active: boolean;
  organizer_id: number;
}

export interface EventRequest {
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  host: string;
  location: EventLocation;
  category_id: number;
  price: number;
  total_seats: number;
  available_seats: number;
  is_active: boolean;
  organizer_id?: string;
}

export interface ParticipantDTO {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface ParticipantResponse {
  id: number;
  event: number;
  user: ParticipantDTO;
}

export interface GetEventsParams {
  category?: string;
  ordering?: string;
  search?: string;
  is_active?: boolean;
  page?: number;
}

export interface GetMyEventsParams {
  ordering?: string;
  search?: string;
  page?: number;
}
