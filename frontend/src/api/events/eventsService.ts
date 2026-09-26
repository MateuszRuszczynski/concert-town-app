//#region imports
import { get, post, patch, remove } from '../httpClient';
import { buildQueryString } from '../shared/buildQueryString';
import type { PaginatedResponse } from '../shared/pagination';
import type {
  EventResponse,
  EventRequest,
  ParticipantResponse,
  GetEventsParams,
  GetMyEventsParams
} from './eventsTypes';
//#endregion

export const eventsService = {
  getEvents: (params: GetEventsParams = {}) =>
    get<PaginatedResponse<EventResponse>>(
      `/api/events/${buildQueryString(params)}`
    ),
  getEvent: (id: string) => get<EventResponse>(`/api/events/${id}/`),
  createEvent: (data: EventRequest, token: string) =>
    post<EventResponse>('/api/events/', data, { token }),
  updateEvent: (id: number, data: Partial<EventRequest>, token: string) =>
    patch<EventResponse>(`/api/events/${id}/`, data, { token }),
  deleteEvent: (id: number, token: string) =>
    remove<void>(`/api/events/${id}/`, { token }),
  getParticipants: (eventId: number, token: string) =>
    get<PaginatedResponse<ParticipantResponse>>(
      `/api/events/event/${eventId}/participants/`,
      { token }
    ),
  getMyEvents: (params: GetMyEventsParams, token: string) =>
    get<PaginatedResponse<EventResponse>>(
      `/api/events/my/${buildQueryString(params)}`,
      { token }
    ),
  getDrafts: (token: string) =>
    get<PaginatedResponse<EventResponse>>('/api/events/my/inactive/', { token }),
  getActiveMyEvents: (token: string) =>
  get<PaginatedResponse<EventResponse>>('/api/events/my/active/', { token }),
};

export const {
  getEvents,
  getEvent,
  getMyEvents,
  getActiveMyEvents,
  getDrafts,
  createEvent,
  updateEvent,
  deleteEvent,
  getParticipants
} = eventsService;
