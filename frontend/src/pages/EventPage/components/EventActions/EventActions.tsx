//#region imports
import { type FC } from 'react';
import type { EventDetails } from '../../../../types/events';
import { OrganizerActions } from './components/OrganizerActions';
import { AttendeeActions } from './components/AttendeeActions';
import { VisitorActions } from './components/VisitorActions';
//#endregion

interface Props {
  event: EventDetails;
  relation: 'organizing' | 'attending' | undefined;
  refetchEvent: () => Promise<void>;
}

export const EventActions: FC<Props> = ({ event, relation, refetchEvent }) => {
  if (relation === 'organizing') return <OrganizerActions event={event} />;
  if (relation === 'attending') return <AttendeeActions event={event} refetchEvent={refetchEvent}/>;
  return <VisitorActions event={event} refetchEvent={refetchEvent} />;
};
