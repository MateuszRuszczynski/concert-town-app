//#region imports
import { useEffect, useState } from 'react';
import { getParticipants } from '../../../api/events';
import { useAuth } from '../../../contexts/AuthContext';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { Participant } from '../../../types/events';
//#endregion

export function useParticipants (eventId: number) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchParticipants () {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await getParticipants(eventId, token);
        setParticipants(
          response.results.map(p => ({
            userId: p.user.id,
            name: `${p.user.first_name} ${p.user.last_name}`,
            email: p.user.email
          }))
        );
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load participants'));
      } finally {
        setIsLoading(false);
      }
    }
    fetchParticipants();
  }, [eventId, token]);

  return { participants, isLoading, error };
}
