//#region imports
import { type FC } from 'react';
import type { EventDetails } from '../../../../types/events';
import { OrganizerActions } from './components/OrganizerActions';
import { AttendeeActions } from './components/AttendeeActions';
import { VisitorActions } from './components/VisitorActions';
//#endregion

interface Props {
  event: EventDetails;
}

export const EventActions: FC<Props> = ({ event }) => {
  if (event.relation === 'organizing') return <OrganizerActions event={event} />;
  if (event.relation === 'attending') return <AttendeeActions event={event} />;
  return <VisitorActions event={event} />;
};
