import type { SortOption, LocationFilter, PriceFilter } from "../types/eventFilters";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'date', label: 'Date' },
  { value: 'price', label: 'Price' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'alphabetical', label: 'Alphabetical' },
];

export const LOCATION_FILTER_OPTIONS: { value: LocationFilter; label: string }[] = [
  { value: 'all', label: 'All locations' },
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
];

export const PRICE_FILTER_OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: 'all', label: 'All prices' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];
