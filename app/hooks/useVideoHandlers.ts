// hooks/useVideoHandlers.ts
import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useVideoPlayer } from 'expo-video';
import { useVideoStore } from './useVideoStore';
import { Metadata } from '@/types';

const useVideoHandlers = () => {
  const { selectedVideoUri, setFormVisible, setSelectedVideoUri, addVideo } = useVideoStore();
  const player = useVideoPlayer(selectedVideoUri || null);

  const handleAddVideo = useCallback(async () => {
    // Check permissions
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'This app needs access to your media library');
      return;
    }

    // Pick video
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 300,
    });

    // Handle result
    if (!result.canceled && result.assets?.[0]) {
      const videoUri = result.assets[0].uri;

      try {
        const fileInfo = await FileSystem.getInfoAsync(videoUri);
        if (!fileInfo.exists) {
          Alert.alert('File not found', 'The selected file does not exist');
          return;
        }

        if (fileInfo.size > 100 * 1024 * 1024) {
          Alert.alert('Video too large', 'Please select a video under 100MB');
          return;
        }

        // Check file type
        const fileExtension = videoUri.split('.').pop()?.toLowerCase();
        const validVideoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'];

        if (!validVideoExtensions.includes(fileExtension)) {
          Alert.alert('Invalid file type', 'Please select a valid video file');
          return;
        }

        setSelectedVideoUri(videoUri);
        setFormVisible(true);
      } catch (error) {
        Alert.alert('Error', 'Unable to process the selected video');
      }
    }
  }, [setSelectedVideoUri, setFormVisible]);

  const handleSubmitVideo = useCallback(async (metadata: Metadata) => {
    if (!selectedVideoUri) return;

    // Generate thumbnail
    try {
      const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(selectedVideoUri, {
        time: 0,
        quality: 0.5,
      });

      // Wait for player to be ready and get duration
      const videoDuration = await new Promise<number>((resolve) => {
        const subscription = player.addListener('statusChange', ({ status }) => {
          if (status === 'readyToPlay') {
            resolve(player.duration);
            subscription.remove();
          }
        });
      });

      // Add video
      const newVideo = {
        id: Date.now().toString(),
        title: metadata.title,
        description: metadata.description,
        uri: selectedVideoUri,
        createdAt: Date.now(),
        thumbnail: thumbnailUri,
        duration: Math.floor(videoDuration),
      };

      addVideo(newVideo);
      setFormVisible(false);
      setSelectedVideoUri(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to process video');
    }
  }, [selectedVideoUri, player, addVideo, setFormVisible, setSelectedVideoUri]);

  return { handleAddVideo, handleSubmitVideo };
};

export default useVideoHandlers;
