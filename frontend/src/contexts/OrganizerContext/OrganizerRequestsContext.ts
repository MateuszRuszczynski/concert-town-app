import { createContext } from 'react';
import type { OrganizerRequest } from '../../types/organizerRequest';

export interface OrganizerRequestsContextType {
  allRequests: OrganizerRequest[];
  pendingCount: number;
  isLoadingAll: boolean;
  decide: (id: number, decision: 'approve' | 'reject') => Promise<void>;
  myRequests: OrganizerRequest[];
  myLatestStatus: OrganizerRequest['status'] | null;
  isLoadingMine: boolean;
  submitRequest: () => Promise<void>;
  refetchAll: () => Promise<void>;
  refetchMine: () => Promise<void>;
}

export const OrganizerRequestsContext = createContext<
  OrganizerRequestsContextType | undefined
>(undefined);
