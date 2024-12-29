import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Video } from '../types';
import React from 'react';

interface Props {
  video: Video;
  onPress: () => void;
}

export default function VideoItem({ video, onPress }: Props) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center p-4 bg-white mb-2 rounded-lg shadow-sm"
    >
      {/* Thumbnail */}
      <Image 
        source={{ uri: video.thumbnail }}
        className="w-20 h-20 rounded-md bg-gray-200"
      />
      
      {/* Video Info */}
      <View className="ml-4 flex-1">
        <Text className="text-lg font-semibold text-gray-800">
          {video.title}
        </Text>
        <Text className="text-sm text-gray-500">
          {new Date(video.createdAt).toLocaleDateString()}
        </Text>
        <Text className="text-sm text-gray-500">
          {video.duration}s
        </Text>
      </View>
    </TouchableOpacity>
  );
}
