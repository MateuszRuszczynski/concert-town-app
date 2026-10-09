import type { PriceFilter, RelationFilter } from "../types/eventFilters";

export type SortBy = 'title' | 'price' | 'date';

export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'date', label: 'Date' },
  { value: 'price', label: 'Price' },
  { value: 'title', label: 'Alphabetical' },
];

export const PRICE_FILTER_OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: 'all', label: 'All prices' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];

export const RELATION_FILTER_OPTIONS: { value: RelationFilter; label: string }[] = [
  { value: 'all', label: 'All events' },
  { value: 'organizing', label: 'Organizing' },
  { value: 'attending', label: 'Attending' },
];
