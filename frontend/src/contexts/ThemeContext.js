import { createContext } from 'react';

/**
 * ThemeContext
 * 
 * For toggling between light and dark.
 * Between remembering and forgetting.
 * Between seeing clearly and seeing softly.
 */
export const ThemeContext = createContext({
  darkMode: true,
  toggleTheme: () => {},
});
