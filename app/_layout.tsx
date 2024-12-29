import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack 
        screenOptions={{
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff'
          },
          // Consistent dark mode in headers
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff'
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000'
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
