export type OrganizerRequestStatus = 'pending' | 'approved' | 'rejected';

export interface OrganizerRequest {
  id: number;
  userId: number;
  userEmail: string;
  status: OrganizerRequestStatus;
  message: string;
  reviewedAt: string | null;
  reviewedById: number | null;
  createdAt: string;
}

