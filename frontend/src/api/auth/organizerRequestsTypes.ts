import type { OrganizerRequestStatus } from "../../types/organizerRequest";

export interface OrganizerRequestResponse {
  id: number;
  user_id: number;
  user_email: string;
  status: OrganizerRequestStatus;
  message: string;
  reviewed_at: string | null;
  reviewed_by_id: number | null;
  created_at: string;
}

export interface GetOrganizerRequestsParams {
  status?: OrganizerRequestStatus;
  ordering?: string;
  page?: number;
}