import { useContext } from 'react';
import { EventsContext } from './EventsContext';

export function useEvents() {
  const context = useContext(EventsContext);

  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }

  return context;
}
