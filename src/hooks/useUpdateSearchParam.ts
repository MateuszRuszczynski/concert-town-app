import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

type ParamValue = string | null;
type ParamUpdates = Record<string, ParamValue>;

export function useUpdateSearchParam() {
  const [, setSearchParams] = useSearchParams();

  const updateSearchParam = useCallback(
    (updates: ParamUpdates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(updates)) {
          if (value) {
            next.set(key, value);
          } else {
            next.delete(key);
          }
        }
        return next;
      });
    },
    [setSearchParams]
  );

  return updateSearchParam;
}
