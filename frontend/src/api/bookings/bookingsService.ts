//#region imports
import { get, post, remove } from '../httpClient';
import { buildQueryString } from '../shared/buildQueryString';
import type { PaginatedResponse, PaginationParams } from '../shared/pagination';
import type { RegistrationResponse } from './bookingsTypes';
//#endregion

const bookingsService = {
  getRegistrations: (params: PaginationParams, token: string) =>
    get<PaginatedResponse<RegistrationResponse>>(
      `/api/bookings/my-registrations/${buildQueryString(params)}`,
      { token }
    ),
  register: (eventId: number, token: string) =>
    post<RegistrationResponse>(
      '/api/bookings/register/',
      { event_id: eventId },
      { token }
    ),
  cancelRegistration: (id: number, token: string) =>
    remove<void>(`/api/bookings/cancel/${id}/`, { token })
};

export const { getRegistrations, register, cancelRegistration } =
  bookingsService;
