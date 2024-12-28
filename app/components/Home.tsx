import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

{/* Components */}
import { Header } from './Header';
import { MetadataForm } from './MetaDataForm';

{/* Store */}
import { useVideoStore } from '../store/videoStore';

{/* Types */}
import { VideoExtension } from '../types';

export default function Home() {
  {/* States */}
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | null>(null);

  {/* Controllers */}
  const addVideo = useVideoStore(state => state.addVideo);

  {/* Handlers */}
  const handleAddVideo = async () => {
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
  };

  const handleSubmitVideo = async (metadata: { title: string; description: string }) => {
    if (!selectedVideoUri) return;

    // Add Metadata
    const newVideo = {
      id: Date.now().toString(),
      title: metadata.title,
      description: metadata.description,
      uri: selectedVideoUri,
      createdAt: Date.now(),
      thumbnail: '', // Will be implemented
      duration: 0    // Will be implemented
    };

    addVideo(newVideo);
    setFormVisible(false);
    setSelectedVideoUri(null);
  };

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
        <FlashList
          data={[]}
          renderItem={() => null}
          estimatedItemSize={100}
          ListEmptyComponent={
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
