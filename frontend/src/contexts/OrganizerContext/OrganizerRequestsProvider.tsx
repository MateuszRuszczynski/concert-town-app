//#region imports
import {
  useCallback,
  useEffect,
  useState,
  type FC,
  type ReactNode
} from 'react';
import type { OrganizerRequest } from '../../types/organizerRequest';
import { useAuth } from '../AuthContext';
import { organizerRequestsService } from '../../api/auth/organizerRequestsService';
import { mapOrganizerRequestResponseToRequest } from '../../api/auth/organizerRequestsMappers';
import { OrganizerRequestsContext } from './OrganizerRequestsContext';
//#endregion

type Props = {
  children: ReactNode;
};

export const OrganizerRequestsProvider: FC<Props> = ({ children }) => {
  const [allRequests, setAllRequests] = useState<OrganizerRequest[]>([]);
  const [myRequests, setMyRequests] = useState<OrganizerRequest[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const [isLoadingMine, setIsLoadingMine] = useState(true);

  const { token, user, isLoading: isAuthLoading } = useAuth();

  const isAdmin = user?.role === 'admin';

  const refetchAll = useCallback(async () => {
  if (isAuthLoading || !token || !isAdmin) {
    setAllRequests([]);
    setIsLoadingAll(false);
    return;
  }
  setIsLoadingAll(true);
  try {
    const response = await organizerRequestsService.getAll(token, { ordering: '-created_at' });
    setAllRequests(response.map(mapOrganizerRequestResponseToRequest)); // без .results
  } catch {
    setAllRequests([]);
  } finally {
    setIsLoadingAll(false);
  }
}, [isAuthLoading, token, isAdmin]);

  const refetchMine = useCallback(async () => {
    if (isAuthLoading || !token || isAdmin) {
      setMyRequests([]);
      setIsLoadingMine(false);
      return;
    }
    setIsLoadingMine(true);
    try {
      const response = await organizerRequestsService.getMine(token);

      const requests = response.results.map(
        mapOrganizerRequestResponseToRequest
      );
      setMyRequests(requests);
    } catch {
      setMyRequests([]);
    } finally {
      setIsLoadingMine(false);
    }
  }, [isAuthLoading, token, isAdmin]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetchAll();
  }, [refetchAll]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetchMine();
  }, [refetchMine]);

  const submitRequest = useCallback(async () => {
    if (!token) throw new Error('Not authenticated');
    await organizerRequestsService.create(token);
    await refetchMine();
  }, [token, refetchMine]);

  const decide = useCallback(
    async (id: number, decision: 'approve' | 'reject') => {
      if (!token) throw new Error('Not authenticated');
      await organizerRequestsService.decide(id, decision, token);
      await refetchAll();
    },
    [token, refetchAll]
  );

  const pendingCount = allRequests.filter(r => r.status === 'pending').length;
  const myLatestStatus = myRequests[0]?.status ?? null;

  return (
    <OrganizerRequestsContext.Provider
      value={{
        allRequests,
        pendingCount,
        isLoadingAll,
        decide,
        myRequests,
        myLatestStatus,
        isLoadingMine,
        submitRequest,
        refetchAll,
        refetchMine
      }}
    >
      {children}
    </OrganizerRequestsContext.Provider>
  );
};
