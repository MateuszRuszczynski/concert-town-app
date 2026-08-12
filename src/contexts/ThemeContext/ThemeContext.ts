import { createContext } from "react";

interface ContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ContextType | undefined>(undefined);
