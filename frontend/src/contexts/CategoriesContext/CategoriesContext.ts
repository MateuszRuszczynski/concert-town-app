import { createContext } from 'react';
import type { Category } from '../../api/categories/categoriesTypes';

export interface CategoriesContextType {
  categories: Category[];
  isLoading: boolean;
  getCategoryName: (id: number) => string;
}

export const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);
