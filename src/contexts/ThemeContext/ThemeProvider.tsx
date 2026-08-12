//#region imports
import {
  useCallback,
  useEffect,
  useMemo,
  type FC,
  type ReactNode
} from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ThemeContext } from './ThemeContext';
//#endregion

type Props = {
  children: ReactNode;
};

export const ThemeProvider: FC<Props> = ({ children }) => {
  const [isDark, saveIsDark] = useLocalStorage(false, 'isDarkTheme');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    saveIsDark(!isDark);
  }, [saveIsDark, isDark]);

  const value = useMemo(
    () => ({
      isDark,
      toggleTheme
    }),
    [isDark, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
