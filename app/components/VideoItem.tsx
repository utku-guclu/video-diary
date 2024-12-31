import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Video } from '../types';
import React from 'react';
import { Feather } from '@expo/vector-icons';

interface Props {
  video: Video;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function VideoItem({ video, onPress, onEdit, onDelete }: Props) {
  const handleEditPress = (e: any) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDeletePress = (e: any) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <TouchableOpacity 
      testID="video-item"
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


      {/* Action Icons */}
      <View className="flex items-center space-x-4 gap-2">
        <TouchableOpacity onPress={handleEditPress}>
          <Feather name="edit" size={20} color="#00FF00" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeletePress}>
          <Feather name="trash" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
