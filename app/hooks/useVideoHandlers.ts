import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useVideoPlayer } from 'expo-video';
import { useVideoStore } from './useVideoStore';
import { CropConfig, ImagePickerResult, Metadata, Video } from '@/types';
import { VideoProcessor } from '@/services/videoProcessor';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const useVideoHandlers = () => {
  const [videoResult, setVideoResult] = useState<ImagePickerResult | null>(null);
  const { selectedVideoUri, setFormVisible, setSelectedVideoUri, addVideo, deleteAllVideos } = useVideoStore();
  const player = useVideoPlayer(selectedVideoUri || null);

  const handleAddVideo = useCallback(async () => {
    // Check platform
    if (Platform.OS === 'web') {
      Alert.alert('Not supported', 'This feature is not supported on web');
      return;
    }

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
    // console.log('handleSubmitVideo called with:', metadata);
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
        const fileInfo = await FileSystem.getInfoAsync(cropConfig.outputUri!);
        if (!fileInfo.exists || fileInfo.size < 1000) { // Basic size sanity check
            throw new Error('Cropped video file is invalid or incomplete');
        }

        // Add retry logic for thumbnail generation
        const MAX_RETRIES = 3;
        let lastError;
        
        for (let i = 0; i < MAX_RETRIES; i++) {
            try {
                // Wait a bit longer between retries
                if (i > 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * i));
                }
                
                const thumbnailUri = await VideoProcessor.generateThumbnail(cropConfig.outputUri!);
                
                // If we get here, thumbnail generation succeeded
                const newVideo: Video = {
                    id: Date.now().toString(),
                    uri: cropConfig.outputUri!,
                    title: `${video.title} (Cropped)`,
                    description: `Cropped version of ${video.title}`,
                    createdAt: Date.now(),
                    duration: cropConfig.duration || (cropConfig.endTime - cropConfig.startTime),
                    thumbnail: thumbnailUri,
                    cropConfig
                };

                addVideo(newVideo);
                return newVideo;
            } catch (e) {
                lastError = e;
                console.log(`Thumbnail generation attempt ${i + 1} failed:`, e);
            }
        }
        
        throw lastError || new Error('Failed to generate thumbnail after multiple attempts');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error processing cropped video:', error);
            throw new Error(`Crop processing failed: ${error.message}`);
        } else {
            console.error('Unexpected error processing cropped video:', error);
            throw new Error('Crop processing failed: An unexpected error occurred');
        }
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
