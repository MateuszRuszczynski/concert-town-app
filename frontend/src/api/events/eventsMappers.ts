//#region imports
import type {
  EventDetails,
  EventFormData
} from '../../types/events';
import type {
  EventRequest,
  EventResponse
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
    status: response.is_active ? 'published' : 'canceled',
    registeredCount,
    image: response.image,
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
    is_active: true,
  };
};

export function mapEventFormDataToPatch(data: Partial<EventFormData>): Partial<EventRequest> {
  const p: Partial<EventRequest> = {};

  if (data.title !== undefined) p.title = data.title;
  if (data.description !== undefined) p.description = data.description;
  if (data.host !== undefined) p.host = data.host;
  if (data.startsAt !== undefined) p.starts_at = data.startsAt;
  if (data.endsAt !== undefined) p.ends_at = data.endsAt;
  if (data.location !== undefined) p.location = data.location;
  if (data.categoryId !== undefined) p.category_id = data.categoryId;
  if (data.price !== undefined) p.price = data.price;
  if (data.capacity !== undefined) p.total_seats = data.capacity;
  if (data.status !== undefined) p.is_active = data.status === 'published';

  return p;
}
