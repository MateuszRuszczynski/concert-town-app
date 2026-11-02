//#region imports
import type { FC } from 'react';
import { ErrorPage } from '../../../pages/ErrorPage';
import { BecomeOrganizerButton } from '../../organizer/BecomeOrganizerButton';
//#endregion

interface Props {
  forbiddenMessage: string;
}

export const OrganizerRequiredPage: FC<Props> = ({ forbiddenMessage }) => (
  <ErrorPage
    type='access-denied'
    title='Organizer access required'
    subtitle={forbiddenMessage}
    buttonText='Back to events'
    backTo='/events'
  >
    <BecomeOrganizerButton />
  </ErrorPage>
);
