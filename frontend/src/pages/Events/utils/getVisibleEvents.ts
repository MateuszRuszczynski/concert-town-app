import type { EventDetails } from '../../../types/events';
import type { FilterParams } from '../types/eventFilters';


export function getVisibleEvents (
  events: EventDetails[],
  { searchQuery, selectedCategories, locationFilter, priceFilter, relationFilter, sortBy }: FilterParams
): EventDetails[] {
  let result = [...events];

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    result = result.filter(event => event.title.toLowerCase().includes(query));
  }

  if (selectedCategories.length > 0) {
    result = result.filter(event =>
      selectedCategories.includes(event.category)
    );
  }

  if (locationFilter !== 'all') {
    result = result.filter(event =>
      locationFilter === 'online'
        ? event.location === 'online'
        : event.location !== 'online'
    );
  }

  if (priceFilter !== 'all') {
    result = result.filter((event) =>
      priceFilter === 'free' ? event.price === 0 : event.price > 0
    );
  }

  if (relationFilter !== 'all') {
    result = result.filter((event) => event.relation === relationFilter);
  }

  const sorted = [...result].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'date':
        return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
      case 'popularity':
        return b.registeredCount - a.registeredCount;
      case 'price':
        return a.price - b.price;
      default:
        return 0;
    }
  });

  return sorted;
}
