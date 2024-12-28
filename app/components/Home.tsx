{/* React */ }
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { useCallback, useRef, useState } from 'react';
{/* Expo */ }
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

{/* Components */ }
import Header from './Header';
import MetadataForm from './MetaDataForm';
import VideoList from './VideoList';
{/* Store */ }
import videoStore from '../store/videoStore';
{/* Types */ }
import { VideoExtension } from '../types';
import { dummyVideos } from '../temp/dummyVideos';
import React from 'react';

export default function Home() {
  {/* States */ }
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | null>(null);

  {/* Refs */ }
  const videoRef = useRef(null);

  {/* Controllers */ }
  const { videos, addVideo } = videoStore();

  {/* Handlers */ }
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
      videoMaxDuration: 300, // 5 minutes max
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const videoUri = asset.uri;

      // Validate video type
      if (asset.type !== 'video') {
        Alert.alert('Invalid file type', 'Please select a video file');
        return;
      }

      if (Platform.OS !== 'web') {
        try {
          // Validate file existence and size
          const fileInfo = await FileSystem.getInfoAsync(videoUri);
          if (!fileInfo.exists) {
            Alert.alert('File not found', 'The selected file does not exist');
            return;
          }

          if (fileInfo.size > 100 * 1024 * 1024) {
            Alert.alert('Video too large', 'Please select a video under 100MB');
            return;
          }

          // Validate file extension
          const fileExtension = videoUri.split('.').pop()?.toLowerCase() as VideoExtension;
          const validVideoExtensions: VideoExtension[] = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'];

          if (!validVideoExtensions.includes(fileExtension)) {
            Alert.alert('Invalid file type', 'Please select a valid video file');
            return;
          }

          setSelectedVideoUri(videoUri);
          setFormVisible(true);

        } catch (error) {
          console.error('Error checking file info:', error);
          Alert.alert('Error', 'Unable to process the selected video');
        }
      } else {
        Alert.alert('Unsupported', 'Video upload is not supported on web platforms');
      }
    }
  }, []);

  const handleSubmitVideo = useCallback(async (metadata: { title: string; description: string }) => {
    if (!selectedVideoUri) return;

    try {
      // Generate thumbnail
      const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(selectedVideoUri, {
        time: 0,
        quality: 0.5,
      });

      const player = useVideoPlayer(selectedVideoUri);
      const videoDuration = await new Promise<number>(resolve => {
        player.addListener('statusChange', ({ status }) => {
          if (status === 'readyToPlay') {
            resolve(player.duration);
          }
        });
      });
      const newVideo = {
        id: Date.now().toString(),
        title: metadata.title,
        description: metadata.description,
        uri: selectedVideoUri,
        createdAt: Date.now(),
        thumbnail: thumbnailUri,
        duration: Math.floor(videoDuration)
      };

      addVideo(newVideo);
      setFormVisible(false);
      setSelectedVideoUri(null);

    } catch (error) {
      console.log('Error processing video:', error);
      Alert.alert('Error', 'Failed to process video');
    }
  }, [selectedVideoUri, addVideo]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Header />
      {/* Content */}
      {isFormVisible ? (
        <MetadataForm
          onSubmit={handleSubmitVideo}
          initialValues={{ title: '', description: '' }}
        />
      ) : (
        <VideoList
          videos={dummyVideos}
          onVideoPress={(video) => {
            // Todo: Handle video selection
          }}
        />
      )}

      {/* Add Button */}
      <TouchableOpacity
        className="absolute bottom-8 right-8 bg-black p-5 rounded-full shadow-xl"
        onPress={handleAddVideo}
      >
        <Text className="text-white text-lg font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
}
