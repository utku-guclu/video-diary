{/* React */ }
import React from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
{/* Expo */ }
import { useVideoPlayer, VideoView } from 'expo-video';

{/* Components */ }
import Header from './Header';
import MetadataForm from './MetaDataForm';
import VideoList from './VideoList';
{/* Store */ }

{/* Types */ }

{/* Temp */ }
import { dummyVideos } from '../temp/dummyVideos';

{/* Hooks */ }
import { useVideoStore } from '@/hooks/useVideoStore';
import useVideoHandlers from '@/hooks/useVideoHandlers';

export default function Home() {
  {/* States */ }

  {/* Refs */ }

  {/* Controllers */ }

  {/* Hooks */ }
  const { 
    videos, 
    isFormVisible, 
    selectedVideoUri
  } = useVideoStore();

  const player = useVideoPlayer(selectedVideoUri || null);

  {/* Handlers */ }
  const { handleAddVideo, handleSubmitVideo } = useVideoHandlers();

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
          videos={[...dummyVideos, ...videos]}
          onVideoPress={(video) => {
            // Todo: Handle video selection
          }}
        />
      )}

      {/* Add Button */}
      {!isFormVisible && (
        <TouchableOpacity
          className="absolute bottom-8 right-8 bg-black w-14 h-14 rounded-full items-center justify-center"
          onPress={handleAddVideo}
        >
          <Text className="text-white text-3xl font-bold">+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

Home.displayName = 'Home';