{/* React */ }
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';

{/* Expo */ }
import { router } from 'expo-router';

{/* Components */ }
import Header from './Header';
import MetadataForm from './MetaDataForm';
import VideoList from './VideoList';

{/* Store */ }

{/* Types */ }

{/* Hooks */ }
import { useVideoStore } from '@/hooks/useVideoStore';
import useVideoHandlers from '@/hooks/useVideoHandlers';
import DatabaseService from '@/db/database';

export default function Home() {
  {/* States */ }

  {/* Refs */ }

  {/* Controllers */ }

  {/* Hooks */ }
  const { 
    videos, 
    isFormVisible, 
    loadVideos
  } = useVideoStore();

  {/* Handlers */ }
  const { handleAddVideo, handleSubmitVideo } = useVideoHandlers();

  {/* Effects */ }
  useEffect(() => {
    loadVideos();
}, []);

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
          videos={videos}
          onVideoPress={(video) => {
            router.push(`/details/${video.id}`);
          }}
        />
      )}

      {/* Add Button */}
      {!isFormVisible && (
        <TouchableOpacity
         style={{ backgroundColor: 'rgba(128, 128, 128, 0.5)' }}
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

function loadVideos() {
  throw new Error('Function not implemented.');
}
