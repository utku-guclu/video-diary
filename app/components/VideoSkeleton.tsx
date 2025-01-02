import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

export const VideoSkeleton = ({count}: {count?: number}) => {
  const theme = useTheme();
  
  return (
    <View 
      className="flex-row items-center p-4 mb-3 rounded-xl animate-pulse"
      style={{ backgroundColor: theme.colors.surface }}
    >
      {/* Thumbnail skeleton */}
      <View 
        className="w-24 h-24 rounded-lg"
        style={{ backgroundColor: theme.colors.muted + '40' }}
      />
      
      {/* Content skeleton */}
      <View className="ml-4 flex-1">
        <View 
          className="h-5 w-3/4 rounded-md mb-2"
          style={{ backgroundColor: theme.colors.muted + '40' }}
        />
        <View 
          className="h-4 w-1/2 rounded-md mb-2"
          style={{ backgroundColor: theme.colors.muted + '40' }}
        />
        <View 
          className="h-4 w-1/4 rounded-md"
          style={{ backgroundColor: theme.colors.muted + '40' }}
        />
      </View>
    </View>
  );
};

export default VideoSkeleton;