//#region imports
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import type { EventFormData } from '../../../types/events';
import {
  createEvent,
  deleteEvent,
  mapEventFormDataToEventRequest,
  mapEventFormDataToPatch,
  updateEvent
} from '../../events';
import { queryKeys } from '../queryKeys';
import { requireToken } from '../requireToken';
//#endregion

export function useCreateEvent () {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: EventFormData) => {
      requireToken(token);
      return createEvent(mapEventFormDataToEventRequest(data), token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    }
  });
}

export function useUpdateEvent () {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      changes
    }: {
      id: number;
      changes: Partial<EventFormData>;
    }) => {
      requireToken(token);
      return updateEvent(id, mapEventFormDataToPatch(changes), token);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.events.all })
  });
}

export function useDeleteEvent () {
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      requireToken(token);
      return deleteEvent(id, token);
    },
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: queryKeys.events.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    }
  });
}
