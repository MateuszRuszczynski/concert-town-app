//#region imports
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getActiveMyEvents, getEvent, getEvents, getInactiveMyEvents, getMyEvents, mapEventResponseToEventDetails, type GetEventsParams } from "../../events";
import { queryKeys } from "../queryKeys";
import { getTotalPages } from "../../../utils/pagination";
import { useAuth } from "../../../contexts/AuthContext";
import { requireToken } from "../requireToken";
import { fetchAllPages } from "../fetchAllPages";
//#endregion

//#region all events

export function useEventsList(params: GetEventsParams) {
  return useQuery({
    queryKey: queryKeys.events.list(params),
    queryFn: () => getEvents(params),
    placeholderData: keepPreviousData,
    select: data => ({
      events: data.results.map(mapEventResponseToEventDetails),
      totalPages: getTotalPages(data.count, 10)
    })
  });
};

export function useAllEvents() {
  return useQuery({
    queryKey: queryKeys.events.everything,
    queryFn: () =>
      fetchAllPages(page => getEvents({ page })),
    select: items => items.map(mapEventResponseToEventDetails),
    staleTime: 60_000
  });
};

//#endregion

//#region event details

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.events.detail(id ?? ''),
    queryFn: () => getEvent(id ?? ''),
    enabled: Boolean(id),
    select: mapEventResponseToEventDetails
  });
};

//#endregion

//#region my events

export function useMyEvents(status: 'all' | 'active' | 'inactive' = 'all', page = 1) {
  const { token, isOrganizerOrAdmin } = useAuth();

  return useQuery({
    queryKey: queryKeys.events.my(status, page),
    queryFn: () => {
      requireToken(token);
      if (status === 'active') return getActiveMyEvents({ page }, token);
      if (status === 'inactive') return getInactiveMyEvents({ page }, token);
      return getMyEvents({ page }, token);
    },
    select: data => ({
      events: data.results.map(mapEventResponseToEventDetails),
      totalPages: getTotalPages(data.count, 10),
      count: data.count
    }),
    enabled: Boolean(token) && isOrganizerOrAdmin,
    placeholderData: keepPreviousData
  });
}; 

export function useAllMyEvents(status: 'all' | 'active' | 'inactive' = 'all') {
  const { token, isOrganizerOrAdmin } = useAuth();

  return useQuery({
    queryKey: queryKeys.events.myAll(status),
    queryFn: async () => {
      requireToken(token);
      const fetchers = { all: getMyEvents, active: getActiveMyEvents, inactive: getInactiveMyEvents };
      const fetcher = fetchers[status];

      return fetchAllPages(page => fetcher({ page }, token));
    },
    select: items => items.map(mapEventResponseToEventDetails),
    enabled: Boolean(token) && isOrganizerOrAdmin
  });
};

//#endregion
