{/* React */ }
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

{/* Expo */ }
import { router } from 'expo-router';

{/* Components */ }
import Header from './Header';
import MetadataForm from './MetaDataForm';
import VideoList from './VideoList';

{/* Hooks */ }
import { useVideoStore } from '@/hooks/useVideoStore';
import useVideoHandlers from '@/hooks/useVideoHandlers';

export default function Home() {
  const {
    videos,
    isFormVisible,
    loadVideos
  } = useVideoStore();

  const { handleAddVideo, handleSubmitVideo } = useVideoHandlers();

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
          isProfileTab={false}  
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


