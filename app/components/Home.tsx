{/* React */ }
import React, { Suspense, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FAB } from 'react-native-paper';

{/* Expo */ }
import { router } from 'expo-router';

{/* Components */ }
import Header from './Header';
import MetadataForm from './MetaDataForm';
import VideoList from './VideoList';
import LoadingAnimation from './LoadingAnimation';

{/* Hooks */ }
import { useVideoStore } from '@/hooks/useVideoStore';
import useVideoHandlers from '@/hooks/useVideoHandlers';
import { useTheme } from '@/providers/ThemeProvider';

export default function Home() {
  const {
    videos,
    isFormVisible,
    loadVideos
  } = useVideoStore();

  const { handleAddVideo, handleSubmitVideo } = useVideoHandlers();

  const theme = useTheme();

  useEffect(() => {
    loadVideos();
  }, []);

  return (
    <View className="flex-1 bg-gray-50" style={{ backgroundColor: theme.colors.background }}>
      {/* Header */}
      <Header title="Video Diary"/>
      {/* Content */}
      {isFormVisible ? (
        <MetadataForm
          onSubmit={handleSubmitVideo}
          initialValues={{ title: '', description: '' }}
        />
      ) : (
        <Suspense fallback={<LoadingAnimation isProfile={false} />}>
          <VideoList
            isProfileTab={false}
            videos={videos}
            onVideoPress={(video) => {
              router.push(`/details/${video.id}`);
            }}
          />
        </Suspense>
      )}

      {/* Add Button */}
      {!isFormVisible && (
        <FAB
          icon="plus"
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: theme.colors.primary,
          }}
          onPress={handleAddVideo}
        />
      )}
    </View>
  );
}

Home.displayName = 'Home';


