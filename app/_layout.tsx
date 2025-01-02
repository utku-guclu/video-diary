import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { ThemeProvider, useTheme } from './providers/ThemeProvider';

import { 
  useFonts,
  Pacifico_400Regular,
} from '@expo-google-fonts/pacifico';

import * as SplashScreen from 'expo-splash-screen';

import { createBaseScreenOptions } from './components/BaseScreenOptions';

SplashScreen.preventAutoHideAsync();

{/* Initialize query client */}
const queryClient = new QueryClient();

{/* Load fonts */}
export default function RootLayout() {
   const [loaded, error] = useFonts({
    Pacifico_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ThemedStack />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function ThemedStack() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={createBaseScreenOptions(theme)}
    >
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          title: 'Video Details',
          presentation: 'modal',
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            color: theme.colors.text,
            fontSize: 18,
            fontWeight: '600',
            fontFamily: theme.fonts.regular,
          },
          animation: 'slide_from_right',
          animationDuration: 200,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
    </Stack>
  );
}
