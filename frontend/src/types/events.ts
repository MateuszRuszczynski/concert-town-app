export type EventCategory =
  | 'conference'
  | 'workshop'
  | 'music'
  | 'networking'
  | 'webinar'
  | 'social';

export interface OfflineLocation {
  city: string;
  venue: string;
}

export type EventLocation = 'online' | OfflineLocation;

export type Participant = {
  userId: string;
  name: string;
  email: string;
};

export interface EventDetails {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startsAt: string;
  endsAt: string;
  location: EventLocation;
  capacity: number;
  price: number;
  registeredCount: number;
  host: string;
  relation?: 'organizing' | 'attending';
  participants? : Participant[];
}

export type EventFormData = Omit<EventDetails, 'id' | 'registeredCount' | 'relation' | 'participants'>;
