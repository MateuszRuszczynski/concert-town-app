import { useState, type Dispatch, type SetStateAction } from 'react';

export function useLocalStorage<T>(
  initialValue: T,
  key: string,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const savedData = localStorage.getItem(key);

    if (!savedData) {
      return initialValue;
    }

    try {
      return JSON.parse(savedData);
    } catch {
      localStorage.removeItem(key);
      return initialValue;
    }
  });

  const saveValue: Dispatch<SetStateAction<T>> = (newValue) => {
    setValue((prev) => {
      const resolvedValue = newValue instanceof Function ? newValue(prev) : newValue;
      localStorage.setItem(key, JSON.stringify(resolvedValue));
      return resolvedValue;
    });
  };

  return [value, saveValue];
}
