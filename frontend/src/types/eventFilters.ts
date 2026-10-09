export type SortOption = 'alphabetical' | 'date' | 'popularity' | 'price';
export type PriceFilter = 'all' | 'free' | 'paid';
export type RelationFilter = 'all' | 'organizing' | 'attending';

export interface FilterParams {
  searchQuery: string;
  selectedCategories: string[];
  priceFilter: PriceFilter;
  relationFilter: RelationFilter;
  sortBy: SortOption;
}

export const DEFAULT_SORT: SortOption = 'date';
export const DEFAULT_PRICE: PriceFilter = 'all';
export const DEFAULT_RELATION: RelationFilter = 'all';

