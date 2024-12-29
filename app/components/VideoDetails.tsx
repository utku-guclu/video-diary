import React from 'react';
import { useRef, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, useWindowDimensions } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';

import videoStore from '../store/videoStore';

import { useOrientation } from '@/hooks/useOrientation';

interface VideoDetailsProps {
  id: string | string[];
}

export default function VideoDetails({ id }: VideoDetailsProps) {
  const videoRef = useRef<Video>(null);
  const orientation = useOrientation();
  const { width, height } = useWindowDimensions();

  const isLandscape = (orientation === 'LANDSCAPE');

  useEffect(() => {
    // Enable rotation
    ScreenOrientation.unlockAsync();

    return () => {
      // Lock to portrait when leaving
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  const video = videoStore((state) => 
    state.videos.find((v) => v.id === id)
  );

  if (!video) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-600">Video not found</Text>
      </View>
    );
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="w-full aspect-video" style={[
        { width: '100%' },
        isLandscape && { 
          height: '100%', 
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10 
        }
      ]}>
        <Video
          ref={videoRef}
          source={{ uri: video.uri }}
          useNativeControls
          resizeMode={ResizeMode.COVER}
          style={{ width: '100%', height: isLandscape ? height : width * 0.5625 }}
        />
      </View>
      
    {!isLandscape && (
        <View className="p-4 space-y-4">
        <View>
          <Text className="text-2xl font-bold text-gray-900">{video.title}</Text>
          <View className="flex-row items-center mt-2 space-x-4">
            <View className="flex-row items-center">
              <MaterialIcons name="access-time" size={16} color="#6B7280" />
              <Text className="ml-1 text-gray-500">{formatDuration(video.duration)}</Text>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons name="calendar-today" size={16} color="#6B7280" />
              <Text className="ml-1 text-gray-500">{formatDate(video.createdAt)}</Text>
            </View>
          </View>
        </View>

        <View className="pt-2">
          <Text className="text-base text-gray-700 leading-relaxed">
            {video.description}
          </Text>
        </View>
      </View>
    )}
    </ScrollView>
  );
}
