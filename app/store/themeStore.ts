import { create } from 'zustand';

interface ThemeStore {
  colorScheme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  colorScheme: 'light',
  toggleTheme: () => set((state) => ({
    colorScheme: state.colorScheme === 'light' ? 'dark' : 'light'
  }))
}));

export default useThemeStore;