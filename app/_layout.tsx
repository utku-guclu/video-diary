import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Video Diary',
            headerShown: true 
          }} 
        />
        <Stack.Screen 
          name="details/[id]" 
          options={{ 
            title: 'Video Details',
            headerShown: true 
          }} 
        />
      </Stack>
    </QueryClientProvider>
  );
}
