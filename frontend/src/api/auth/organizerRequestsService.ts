//#region imports
import { get, post } from '../httpClient';
import { buildQueryString } from '../shared/buildQueryString';
import type { PaginatedResponse } from '../shared/pagination';
import type {
  OrganizerRequestResponse,
  GetOrganizerRequestsParams
} from './organizerRequestsTypes';
//#endregion

export const organizerRequestsService = {
  getAll: (token: string, params: GetOrganizerRequestsParams = {}) =>
    get<OrganizerRequestResponse[]>(
      `/api/auth/organizer-requests/${buildQueryString(params)}`,
      { token }
    ),

  create: (token: string) => post<void>('/api/auth/organizer-requests/', {}, { token }),

  decide: (id: number, decision: 'approve' | 'reject', token: string) =>
    post<void>(`/api/auth/organizer-requests/${id}/${decision}/`, {}, { token }),

  getMine: (token: string, params: GetOrganizerRequestsParams = {}) =>
    get<PaginatedResponse<OrganizerRequestResponse>>(
      `/api/auth/organizer-requests/mine/${buildQueryString(params)}`,
      { token }
    ),
};