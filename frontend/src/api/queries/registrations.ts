//#region imports
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { queryKeys } from './queryKeys';
import { requireToken } from './requireToken';
import {
  cancelRegistration,
  getRegistrations,
  register
} from '../bookings/bookingsService';
import { mapEventResponseToEventDetails } from '../events';
import { fetchAllPages } from './fetchAllPages';
import { getTotalPages } from '../../utils/pagination';
//#endregion

//#region queries

export function useMyRegistrations (page: number) {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.registrations.list(page),
    queryFn: () => {
      requireToken(token);

      return getRegistrations({ page }, token);
    },
    select: data => ({
      registrations: data.results.map(r => ({ id: r.id, event: mapEventResponseToEventDetails(r.event)})),
      events: data.results.map(r => (mapEventResponseToEventDetails(r.event))),
      totalPages: getTotalPages(data.count, 10),
    }),
    enabled: Boolean(token)
  });
}

export function useAllRegistrations () {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.registrations.everything,
    queryFn: () => {
      requireToken(token);
      return fetchAllPages((page: number) => getRegistrations({ page }, token));
    },
    select: data => ({
      registrations: data.map(r => ({ id: r.id, event: mapEventResponseToEventDetails(r.event)})),
      events: data.map(r => (mapEventResponseToEventDetails(r.event))),
    }),
    enabled: Boolean(token),
    staleTime: 60_000,
  });
}

//#endregion

//#region mutations

export function useRegister () {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (eventId: number) => {
      requireToken(token);

      return register(eventId, token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
        qc.invalidateQueries({ queryKey: queryKeys.registrations.all })
    }
  });
}

export function useCancelRegistration () {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      requireToken(token);

      return cancelRegistration(id, token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
        qc.invalidateQueries({ queryKey: queryKeys.registrations.all });

    }
  });
}

//#endregion
