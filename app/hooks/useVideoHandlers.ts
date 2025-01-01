import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer } from 'expo-video';
import { useVideoStore } from './useVideoStore';
import { CropConfig, ImagePickerResult, Metadata, Video } from '@/types';
import { VideoProcessor } from '@/utils/videoProcessor';

const useVideoHandlers = () => {
  const [videoResult, setVideoResult] = useState<ImagePickerResult | null>(null);
  const { selectedVideoUri, setFormVisible, setSelectedVideoUri, addVideo, cropVideo } = useVideoStore();
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
      /* I use MediaTypeOptions here instead of MediaType since I can't get it to work  */
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
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
      // Generate new thumbnail for cropped segment
      const thumbnailUri = await VideoProcessor.generateThumbnail(video.uri);
      
      // Update video metadata with crop info and new thumbnail
      const updates = {
        startTime: cropConfig.startTime,
        endTime: cropConfig.endTime,
        cropConfig,
        thumbnail: thumbnailUri,
        duration: cropConfig.endTime - cropConfig.startTime
      };
      
      await cropVideo(video.id, updates);
      
    } catch (error) {
      console.error('Error processing cropped video:', error);
      Alert.alert('Error', 'Failed to process cropped video');
    }
  }, [cropVideo]);

  return { handleAddVideo, handleSubmitVideo, handleCropComplete };
};

export default useVideoHandlers;
