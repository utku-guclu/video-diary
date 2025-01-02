import React, { createContext, useContext } from 'react';
import { useThemeStore } from '../store/themeStore';
import { lightTheme, darkTheme } from '../theme';
import { Theme } from '@/types';

export interface ExtendedTheme extends Theme {
  fonts: {
    regular: string;
  };
}

const lightThemeWithFonts: ExtendedTheme = {
  ...lightTheme,
  fonts: {
    regular: 'Pacifico_400Regular',
  }
};

const darkThemeWithFonts: ExtendedTheme = {
  ...darkTheme,
  fonts: {
    regular: 'Pacifico_400Regular',
  }
};

const ThemeContext = createContext<ExtendedTheme>(lightThemeWithFonts);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme } = useThemeStore();
  const theme = colorScheme === 'dark' ? darkThemeWithFonts : lightThemeWithFonts;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
