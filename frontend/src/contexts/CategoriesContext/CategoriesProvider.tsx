//#region imports
import { useCallback, useEffect, useState, type FC, type ReactNode } from "react";
import type { Category } from "../../api/categories/categoriesTypes";
import { categoriesService } from "../../api/categories/categoriesService";
import { CategoriesContext } from "./CategoriesContext";
//#endregion

type Props = {
  children: ReactNode;
};

export const CategoriesProvider: FC<Props> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();

    async function fetchCategories() {
      try {
        const response = await categoriesService.getCategories();
        setCategories(response.results);
      } catch {
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const getCategoryName = useCallback(
    (id: number) => {
      return categories.find((c) => c.id === id)?.name ?? 'Unknown'
    },
    [categories]
  );

  return (
    <CategoriesContext.Provider value={{ categories, isLoading, getCategoryName }}>
      {children}
    </CategoriesContext.Provider>
  );
};