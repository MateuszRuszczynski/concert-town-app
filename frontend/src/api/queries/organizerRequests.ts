//#region imports
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import {
  getAllOrganizerRequests,
  createOrganizerRequest,
  decide,
  getMineRequests
} from '../../api/auth';
import { mapOrganizerRequestResponseToRequest } from '../auth';
import { queryKeys } from './queryKeys';
import { requireToken } from './requireToken';
//#endregion

//#region queries

export function useAllOrganizerRequests () {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: queryKeys.organizerRequests.all,
    queryFn: () => {
      requireToken(token);
      return getAllOrganizerRequests(token);
    },
    select: data => data.map(mapOrganizerRequestResponseToRequest),
    enabled: Boolean(token) && user?.role === 'admin'
  });
}

export function useMyOrganizerRequests () {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: queryKeys.organizerRequests.mine,
    queryFn: () => {
      requireToken(token);
      return getMineRequests(token);
    },
    select: data => data.results.map(mapOrganizerRequestResponseToRequest),
    enabled: Boolean(token) && user !== null && user.role !== 'admin'
  });
}

//#endregion

//#region derived

export function usePendingRequestsCount () {
  const { data } = useAllOrganizerRequests();

  return data?.filter(r => r.status === 'pending').length ?? 0;
}

export function useMyLatestRequestStatus () {
  const { data } = useMyOrganizerRequests();

  return data?.[0]?.status ?? null;
}

//#endregion

//#region mutations

export function useSubmitOrganizerRequest () {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => {
      requireToken(token);
      return createOrganizerRequest(token);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.organizerRequests.mine })
  });
}

export function useDecideOrganizerRequest () {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      decision
    }: {
      id: number;
      decision: 'approve' | 'reject';
    }) => {
      requireToken(token);
      return decide(id, decision, token);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.organizerRequests.all })
  });
}

//#endregion
