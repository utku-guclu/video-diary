import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Video } from '../types';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';

interface Props {
  video: Video;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCrop: () => void;
}

export default function VideoItem({ video, onPress, onEdit, onDelete }: Props) {
  const theme = useTheme();

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
      className="flex-row items-center p-4 mb-3 rounded-xl"
      style={{
        backgroundColor: theme.colors.surface,
        shadowColor: theme.colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Thumbnail */}
      <Image 
        source={{ uri: video.thumbnail }}
        className="w-24 h-24 rounded-lg"
        style={{ backgroundColor: theme.colors.muted }}
      />
      
      {/* Video Info */}
      <View className="ml-4 flex-1">
        <Text 
          className="text-lg font-semibold mb-1" 
          style={{ color: theme.colors.text }}
          numberOfLines={1}
        >
          {video.title}
        </Text>
        <Text 
          className="text-sm mb-1 italic" 
          style={{ color: theme.colors.muted }}
        >
          {new Date(video.createdAt).toLocaleDateString()}
        </Text>
        <Text 
          className="text-sm" 
          style={{ color: theme.colors.muted }}
        >
          {video.duration}s
        </Text>
      </View>

      {/* Action Icons */}
      <View className="flex-col items-center space-x-5 pl-2 gap-4">
        <TouchableOpacity 
          onPress={handleEditPress}
          className="p-2"
          style={{ backgroundColor: `${theme.colors.success}20` }}
        >
          <Feather name="edit" size={20} color={theme.colors.success}/>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleDeletePress}
          className="p-2"
          style={{ backgroundColor: `${theme.colors.error}20` }}
        >
          <Feather name="trash" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
