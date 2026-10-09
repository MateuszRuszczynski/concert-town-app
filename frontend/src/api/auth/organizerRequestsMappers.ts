import type { OrganizerRequest } from '../../types/organizerRequest';
import type { OrganizerRequestResponse } from './organizerRequestsTypes';

export function mapOrganizerRequestResponseToRequest(response: OrganizerRequestResponse): OrganizerRequest {
  return {
    id: response.id,
    userId: response.user_id,
    userEmail: response.user_email,
    status: response.status,
    message: response.message,
    reviewedAt: response.reviewed_at,
    reviewedById: response.reviewed_by_id,
    createdAt: response.created_at,
  };
}