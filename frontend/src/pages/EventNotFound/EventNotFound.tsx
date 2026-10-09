import { ErrorPage } from '../ErrorPage';

export const EventNotFound = () => (
  <ErrorPage
    title='Event not found'
    subtitle='This event may have been removed.'
    buttonText='Back to events'
    backTo='/events'
  />
);
