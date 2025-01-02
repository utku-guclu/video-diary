import { Platform } from 'react-native';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { ExtendedTheme } from '@/providers/ThemeProvider';

export const createTabScreenOptions = (theme: ExtendedTheme): BottomTabNavigationOptions => ({
  tabBarStyle: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 0,
    elevation: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingTop: Platform.OS === 'ios' ? 30 : 10,
  },
  tabBarActiveTintColor: theme.colors.primary,
  tabBarInactiveTintColor: theme.colors.muted,
  headerStyle: {
    backgroundColor: theme.colors.surface,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: theme.colors.text,
  headerTitleStyle: {
    fontWeight: '600' as const,
    fontSize: 18,
    fontFamily: theme.fonts.regular,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '500' as const,
    fontFamily: theme.fonts.regular,
  },
});

export default createTabScreenOptions;
