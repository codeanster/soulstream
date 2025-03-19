import { createContext, useContext } from 'react';

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

/**
 * useTheme hook
 * 
 * A way to access the theme context.
 * To feel the darkness or embrace the light.
 */
export const useTheme = () => {
  return useContext(ThemeContext);
};
