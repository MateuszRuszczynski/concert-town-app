export type SortBy = 'title' | 'price' | 'date';

export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'date', label: 'Date' },
  { value: 'price', label: 'Price' },
  { value: 'title', label: 'Title' },
];
