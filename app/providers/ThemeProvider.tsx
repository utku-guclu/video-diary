import React, { createContext, useContext } from 'react';
import { useThemeStore } from '../store/themeStore';
import { lightTheme, darkTheme } from '../theme';

type Theme = {
  colors: {
    background: string;
    text: string;
    primary: string;
  }
}

const ThemeContext = createContext<Theme>(lightTheme);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme } = useThemeStore();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;