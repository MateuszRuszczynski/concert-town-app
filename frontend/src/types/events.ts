interface OfflineLocation {
  city: string;
  venue: string;
}

export type EventLocation = 'online' | OfflineLocation;

export type Participant = {
  userId: number;
  name: string;
  email: string;
};

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export type EventStatus = 'published' | 'canceled';

export type RelationFilter = 'all' | 'organizing' | 'attending';

export interface EventDetails {
  id: number;
  title: string;
  description: string;
  category: Category | null;
  startsAt: string;
  endsAt: string;
  location: EventLocation;
  capacity: number;
  price: string;
  registeredCount: number;
  host: string;
  organizerId: number;
  status: EventStatus;
  image: string | null;
};

export type EventFormData = Omit<
  EventDetails,
  | 'id'
  | 'organizerId'
  | 'category'
  | 'registeredCount'
  | 'image'
> & {
  categoryId: number;
};
