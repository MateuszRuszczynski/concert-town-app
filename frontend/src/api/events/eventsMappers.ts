//#region imports
import type {
  EventDetails,
  EventFormData,
  Participant
} from '../../types/events';
import type {
  EventRequest,
  EventResponse,
  ParticipantDTO
} from './eventsTypes';
//#endregion

export function mapEventResponseToEventDetails (
  response: EventResponse
): EventDetails {
  const registeredCount = response.total_seats - response.available_seats;

  return {
    id: response.id,
    title: response.title,
    description: response.description,
    host: response.host,
    category: response.category,
    organizerId: response.organizer_id,
    startsAt: response.starts_at,
    endsAt: response.ends_at,
    location: response.location,
    capacity: response.total_seats,
    price: response.price,
    status: response.is_active ? 'published' : 'draft',
    registeredCount,
    isActive: response.is_active,
  };
}

export function mapEventFormDataToEventRequest (
  data: EventFormData
): EventRequest {
  return {
    title: data.title,
    description: data.description,
    host: data.host,
    starts_at: data.startsAt,
    ends_at: data.endsAt,
    location: data.location,
    category_id: data.categoryId,
    price: data.price,
    total_seats: data.capacity,
    available_seats: data.capacity - data.registeredCount,
    is_active: data.status === 'published',
  };
}

export function mapParticipantResponseToParticipant (
  response: ParticipantDTO
): Participant {
  return {
    userId: response.id,
    name: `${response.first_name} ${response.last_name}`,
    email: response.email
  };
}
