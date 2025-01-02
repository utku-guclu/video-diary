import { Platform } from 'react-native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { ExtendedTheme } from '@/providers/ThemeProvider';

export const createBaseScreenOptions = (theme: ExtendedTheme): NativeStackNavigationOptions => ({
  contentStyle: {
    backgroundColor: theme.colors.background,
  },
  headerStyle: {
    backgroundColor: theme.colors.surface,
  },
  headerTintColor: theme.colors.primary,
  headerTitleStyle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '600' as const,
    fontFamily: theme.fonts.regular,
  },
  animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
  animationDuration: 200,
});

export default createBaseScreenOptions;