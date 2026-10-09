import { useContext } from 'react';
import { OrganizerRequestsContext } from './OrganizerRequestsContext';

export function useOrganizerRequests () {
  const context = useContext(OrganizerRequestsContext);

  if (!context) {
    throw new Error(
      'useOrganizerRequests must be used within OrganizerRequestsProvider'
    );
  }

  return context;
}
