import type { PaginatedResponse } from "../shared/pagination";

export async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<PaginatedResponse<T>>
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const response = await fetchPage(page);
    all.push(...response.results);
    hasNext = Boolean(response.next);
    page++;
  }

  return all;
};
