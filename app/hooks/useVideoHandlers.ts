import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer } from 'expo-video';
import { useVideoStore } from './useVideoStore';
import { CropConfig, ImagePickerResult, Metadata, Video } from '@/types';
import { VideoProcessor } from '@/utils/videoProcessor';

const useVideoHandlers = () => {
  const [videoResult, setVideoResult] = useState<ImagePickerResult | null>(null);
  const { selectedVideoUri, setFormVisible, setSelectedVideoUri, addVideo, deleteAllVideos } = useVideoStore();
  const player = useVideoPlayer(selectedVideoUri || null);

  const handleAddVideo = useCallback(async () => {
    // Check permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'This app needs access to your media library');
      return;
    }
    console.log("Permission granted!");

    // Pick video
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
      videoMaxDuration: 300,
    });

    // Handle result
    if (!result?.canceled && result?.assets?.[0]) {
      const videoUri = result.assets[0].uri;

      try {
        const validation = await VideoProcessor.validateVideo(videoUri);
        if (!validation.exists) {
          Alert.alert('File not found', 'The selected file does not exist');
          return;
        }

        if (validation.size > 100 * 1024 * 1024) {
          Alert.alert('Video too large', 'Please select a video under 100MB');
          return;
        }

        if (!validation.isValidType) {
          Alert.alert('Invalid file type', 'Please select a valid video file');
          return;
        }

        setVideoResult(result);
        setSelectedVideoUri(videoUri);
        setFormVisible(true);
      } catch (error) {
        Alert.alert('Error', 'Unable to process the selected video');
      }
    }
  }, [setSelectedVideoUri, setFormVisible]);

  const handleSubmitVideo = useCallback(async (metadata: Metadata) => {
    console.log('handleSubmitVideo called with:', metadata);
    if (!selectedVideoUri || !videoResult?.assets?.[0]) return;

    // Generate thumbnail
    try {
      console.log('Generating thumbnail...');
      const thumbnailUri = await VideoProcessor.generateThumbnail(selectedVideoUri);

      // Create a new video object
      const newVideo = {
        id: Date.now().toString(),
        title: metadata.title,
        description: metadata.description,
        uri: selectedVideoUri,
        createdAt: Date.now(),
        thumbnail: thumbnailUri,
        duration: Math.floor((videoResult.assets?.[0]?.duration ?? 0) / 1000),
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


  const handleCropComplete = useCallback(async (video: Video, cropConfig: CropConfig) => {
    try {
      // Generate thumbnail for cropped video
      // const thumbnailUri = await VideoProcessor.generateThumbnail(video.thumbnail);

      // Create new video object for cropped version
      const newVideo: Video = {
        id: Date.now().toString(),
        uri: cropConfig.outputUri!,
        title: `${video.title} (Cropped)`,
        description: `Cropped version of ${video.title}`,
        createdAt: Date.now(),
        duration: cropConfig.duration,
        thumbnail: video.thumbnail,
        cropConfig
      };

      // Add cropped video to store
      addVideo(newVideo);

      return newVideo;
    } catch (error) {
      console.error('Error processing cropped video:', error);
      throw error; // Let the mutation handler deal with the error
    }
  }, [addVideo]);

  const handleDeleteVideos = () => {
    Alert.alert(
      'Delete Videos',
      'Are you sure you want to delete all videos? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteAllVideos();
            Alert.alert('Success', 'All videos have been deleted.');
          }
        }
      ]
    );
  };

  return { handleAddVideo, handleSubmitVideo, handleCropComplete, handleDeleteVideos };
};


export default useVideoHandlers;
