//#region imports
import { client } from '../httpClient';
import type { PaginatedResponse } from '../shared/pagination';
import type { Category } from './categoriesTypes';
//#endregion

export const categoriesService = {
  getCategories: () =>
    client.get<PaginatedResponse<Category>>('/api/events/categories/'),
};
