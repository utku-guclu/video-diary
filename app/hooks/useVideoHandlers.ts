// hooks/useVideoHandlers.ts
import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useVideoPlayer } from 'expo-video';
import { useVideoStore } from './useVideoStore';
import { FileInfo, ImagePickerResult, Metadata } from '@/types';

const useVideoHandlers = () => {
  const { selectedVideoUri, setFormVisible, setSelectedVideoUri, addVideo } = useVideoStore();
  const player = useVideoPlayer(selectedVideoUri || null);

  let pickerResult: ImagePickerResult | null = null;

  const handleAddVideo = useCallback(async () => {
    // Check permissions
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'This app needs access to your media library');
      return;
    }
    console.log("Permission granted!");

    // Pick video
    pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 300,
    });

    console.log("RESULT", pickerResult)
    // Handle result
    if (!pickerResult?.canceled && pickerResult?.assets?.[0]) {
      const videoUri = pickerResult.assets[0].uri;

      try {
        const fileInfo = await FileSystem.getInfoAsync(videoUri) as FileInfo;
        if (!fileInfo.exists) {
          Alert.alert('File not found', 'The selected file does not exist');
          return;
        }

        if (fileInfo.size > 100 * 1024 * 1024) {
          Alert.alert('Video too large', 'Please select a video under 100MB');
          return;
        }

        // Check file type
        const fileExtension = videoUri.split('.').pop()?.toLowerCase()!;
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
    console.log('handleSubmitVideo called with:', metadata);
    if (!selectedVideoUri) return;

    // Generate thumbnail
    try {
      console.log('Generating thumbnail...');
      const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(selectedVideoUri, {
        time: 0,
        quality: 0.5,
      });

      const videoDuration = pickerResult?.assets?.[0].duration ?? 0;

      // Create a new video object
      const newVideo = {
        id: Date.now().toString(),
        title: metadata.title,
        description: metadata.description,
        uri: selectedVideoUri,
        createdAt: Date.now(),
        thumbnail: thumbnailUri,
        duration: Math.floor(videoDuration),
      };

      console.log('Adding new video:', newVideo);
      // Save to store
      addVideo(newVideo);

      // Reset form state
      setFormVisible(false);
      setSelectedVideoUri(null);

      // Show success message
      Alert.alert('Success', 'Video saved successfully!');
    } catch (error) {
      console.error('Error in handleSubmitVideo:', error);
      Alert.alert('Error', 'Failed to process video');
    }
  }, [selectedVideoUri, player, addVideo, setFormVisible, setSelectedVideoUri]);

  return { handleAddVideo, handleSubmitVideo };
};

export default useVideoHandlers;
