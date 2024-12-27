import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { VideoExtension } from '../types';

export default function Home() {
  const handleAddVideo = async () => {
    // First check permissions
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'This app needs access to your media library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 300, // 5 minutes max
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      // Check if the selected file is a video
      if (asset.type !== 'video') {
        Alert.alert('Invalid file type', 'Please select a video file');
        return;
      }

      const videoUri = result.assets[0].uri;

      if (Platform.OS !== 'web') {
        try {
          const fileInfo = await FileSystem.getInfoAsync(videoUri);

          if (fileInfo.exists) {
            const fileSize = fileInfo.size;
            if (fileSize > 100 * 1024 * 1024) {
              Alert.alert('Video too large', 'Please select a video under 100MB');
              return;
            }

            // Additional secure check for video file type
            const fileExtension = videoUri.split('.').pop()?.toLowerCase() as VideoExtension;

            const validVideoExtensions: VideoExtension[] = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'];

            if (!validVideoExtensions.includes(fileExtension)) {
              Alert.alert('Invalid file type', 'Please select a valid video file');
              return;
            }
          } else {
            Alert.alert('File not found', 'The selected file does not exist');
          }
        } catch (error) {
          console.error('Error checking file info:', error);
          Alert.alert('Error', 'Unable to process the selected video');
        }
        // Process the valid video
        handleValidVideo(videoUri);
      } else {
        // Web platform: Stop the process
        console.log('File system checks are not available on web. Stopping the process.');
        Alert.alert('Unsupported', 'Video upload is not supported on web platforms');
      }
    }
  };

  const handleValidVideo = async (videoUri: string) => {
    // Here we'll add:
    // 1. Video metadata extraction
    // 2. Thumbnail generation
    // 3. Save to local storage
    // 4. Update video list
    console.log('Processing video:', videoUri);
  };


  return (
    // Main container with full height and light gray background
    <View className="flex-1 bg-gray-50">
      {/* Header section with white background and shadow */}
      <View className="p-6 bg-white shadow-sm">
        <Text className="text-3xl font-bold text-primary">
          Video Diary
        </Text>
      </View>

      {/* FlashList for efficient rendering of video items */}
      <FlashList
        data={[]}  // Array of videos (empty for now)
        renderItem={() => null}  // How each video item should render
        estimatedItemSize={100}  // Helps FlashList optimize performance
        ListEmptyComponent={
          // Shown when no videos are available
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-2xl font-semibold text-gray-800 mb-2">
              Your Video Collection
            </Text>
            <Text className="text-gray-500 text-center text-lg">
              No videos yet. Start by adding one!
            </Text>
          </View>
        }
      />

      {/* Floating action button for adding new videos */}
      <TouchableOpacity
        className="absolute bottom-8 right-8 bg-black p-5 rounded-full shadow-xl"
        onPress={handleAddVideo}
      >
        <Text className="text-white text-lg font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
}
