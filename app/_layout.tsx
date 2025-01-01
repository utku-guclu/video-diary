import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ThemeProvider, useTheme } from './providers/ThemeProvider';

const queryClient = new QueryClient();

export default function RootLayout() {
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
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors.background
        },
        headerStyle: {
          backgroundColor: theme.colors.background
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          color: theme.colors.text
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="details/[id]"
        options={{
          title: 'Video Details',
          presentation: 'modal',
          animation: 'slide_from_right',
          headerStyle: {
          backgroundColor: theme.colors.background
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
          },
        }}
      />
    </Stack>
  );
}
