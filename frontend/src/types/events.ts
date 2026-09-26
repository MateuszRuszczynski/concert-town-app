export interface EventLocation {
  city: string;
  venue: string;
}

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

export type EventStatus = 'draft' | 'published';

export interface EventDetails {
  id: number;
  title: string;
  description: string;
  category: Category;
  startsAt: string;
  endsAt: string;
  location: EventLocation;
  capacity: number;
  price: number;
  registeredCount: number;
  host: string;
  organizerId: number;
  status: EventStatus;
  image?: File | null | undefined;
  isActive: boolean;
}

export type EventFormData = Omit<
  EventDetails,
  | 'id'
  | 'organizerId'
  | 'participants'
  | 'category'
  | 'isActive'
> & {
  categoryId: number;
  status: EventStatus;
};
