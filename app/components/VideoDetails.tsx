import React from 'react';
import { useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Alert } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video'
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';

import EditVideoModal from '@/modals/EditVideoModal';
import CropVideoModal from '@/modals/CropVideoModal';

import videoStore from '../store/videoStore';

import { useOrientation } from '@/hooks/useOrientation';

import { useTheme } from '@/providers/ThemeProvider';

interface VideoDetailsProps {
  id: string | string[];
}

export default function VideoDetails({ id }: VideoDetailsProps) {
  const theme = useTheme();
  const orientation = useOrientation();
  const { width, height } = useWindowDimensions();

  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showCropModal, setShowCropModal] = React.useState(false);

  const isLandscape = (orientation === 'LANDSCAPE');

  const { deleteVideo, updateVideo } = videoStore();
  const video = videoStore((state) => state.videos.find((video) => video.id === id));

  const player = useVideoPlayer(video?.uri || '', (player) => {
    player.timeUpdateEventInterval = 0.5;
  });

  useEffect(() => {
    // Enable rotation
    ScreenOrientation.unlockAsync();

    return () => {
      // Lock to portrait when leaving
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

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
    <>
      <ScrollView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
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
          <VideoView
            player={player}
            style={{ width: '100%', height: isLandscape ? height : width * 0.5625 }}
            contentFit="cover"
            nativeControls
          />
        </View>

        {!isLandscape && (
          <View className="p-4 space-y-4">
            <View className="flex-row justify-between items-center">
              <Text style={{ color: theme.colors.text }} className="text-2xl font-bold">{video.title}</Text>
              <View className="flex-row space-x-4 gap-4">
                <TouchableOpacity onPress={() => setShowCropModal(true)}>
                  <Feather name="crop" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEditModal(true)}>
                  <Feather name="edit-2" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Delete Video",
                      "Are you sure you want to delete this video?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => deleteVideo(video.id)
                        }
                      ]
                    );
                  }}
                >
                  <Feather name="trash-2" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-center mt-2 space-x-4 gap-4">
              <View className="flex-row items-center">
                <MaterialIcons name="access-time" size={16} color="#6B7280" />
                <Text style={{ color: theme.colors.text }} className="ml-1 text-gray-500">{formatDuration(video.duration)}</Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons name="calendar-today" size={16} color="#6B7280" />
                <Text style={{ color: theme.colors.text }}  className="ml-1 text-gray-500">{formatDate(video.createdAt)}</Text>
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

      <EditVideoModal
        visible={showEditModal}
        video={video}
        onClose={() => setShowEditModal(false)}
        onSave={(updates) => {
          updateVideo(video.id, updates);
          setShowEditModal(false);
        }}
      />

      <CropVideoModal
        visible={showCropModal}
        video={video}
        onClose={() => setShowCropModal(false)}
      />
    </>
  );
}
