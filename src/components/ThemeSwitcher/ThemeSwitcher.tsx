//#region imports
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/useTheme';
import { IconButton } from '../IconButton';
//#endregion

export const ThemeSwitcher = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <Sun size={16} color='#fafafa' aria-hidden='true' />
      ) : (
        <Moon size={16} aria-hidden='true' />
      )}
    </IconButton>
  );
};
