import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { lightTheme, darkTheme } from './theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack 
        screenOptions={{
          contentStyle: {
            backgroundColor: theme.colors.background
          },
          // Consistent dark mode in headers
          headerStyle: {
            backgroundColor: theme.colors.background
          },
          headerTintColor: theme.colors.text
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="details/[id]" 
          options={{ 
            title: 'Video Details',
            // Additional dark mode styles for details screen
            presentation: 'modal',
            animation: 'slide_from_right'
          }} 
        />
      </Stack>
    </QueryClientProvider>
  );
}
