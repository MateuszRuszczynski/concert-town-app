//#region imports
import { client } from '../httpClient';
import { buildQueryString } from '../shared/buildQueryString';
import type { PaginatedResponse } from '../shared/pagination';
import type {
  Bookings,
  GetMyRegistrationsParams,
  RegisterResponse
} from './bookingsTypes';
//#endregion

export const bookingsService = {
  getRegistrations: (params: GetMyRegistrationsParams, token: string) =>
    client.get<PaginatedResponse<Bookings>>(
      `/api/bookings/my-registrations/${buildQueryString(params)}`,
      { token }
    ),
  register: (eventId: number, token: string) =>
    client.post<RegisterResponse>(
      '/api/bookings/register/',
      { event_id: eventId },
      { token }
    ),
  cancelRegistration: (id: number, token: string) =>
    client.delete<void>(`/api/bookings/cancel/${id}/`, { token })
};

export const { getRegistrations, register, cancelRegistration } =
  bookingsService;
