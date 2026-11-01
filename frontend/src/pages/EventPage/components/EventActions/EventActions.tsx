//#region imports
import { type FC } from 'react';
import type { EventDetails } from '../../../../types/events';
import { OrganizerActions } from './components/OrganizerActions';
import { AttendeeActions } from './components/AttendeeActions';
import { VisitorActions } from './components/VisitorActions';
import { useAuth } from '../../../../contexts/AuthContext';
//#endregion

interface Props {
  event: EventDetails;
  relation: 'organizing' | 'attending' | undefined;
}

export const EventActions: FC<Props> = ({ event, relation }) => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return (
      <>
        {relation === 'attending' ? (
          <AttendeeActions event={event} />
        ) : (
          <VisitorActions event={event} />
        )}
        
        <OrganizerActions event={event} />
      </>
    );
  }

  if (relation === 'organizing') return <OrganizerActions event={event} />;
  if (relation === 'attending') return <AttendeeActions event={event} />;

  return <VisitorActions event={event} />;
};
