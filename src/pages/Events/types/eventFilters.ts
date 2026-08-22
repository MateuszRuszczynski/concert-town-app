import type { EventCategory } from "../../../types/events";

export type LocationFilter = 'all' | 'online' | 'offline';
export type SortOption = 'alphabetical' | 'date' | 'popularity' | 'price';
export type PriceFilter = 'all' | 'free' | 'paid';
export type RelationFilter = 'all' | 'organizing' | 'attending';

export interface FilterParams {
  searchQuery: string;
  selectedCategories: EventCategory[];
  locationFilter: LocationFilter;
  priceFilter: PriceFilter;
  relationFilter: RelationFilter;
  sortBy: SortOption;
}
