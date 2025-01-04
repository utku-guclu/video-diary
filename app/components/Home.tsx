{/* React */ }
import React, { Suspense, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FAB } from 'react-native-paper';

{/* Components */ }
import Header from './Header';
import MetadataForm from './MetaDataForm';
import LoadingAnimation from './LoadingAnimation';

{/* Hooks */ }
import useVideoHandlers from '@/hooks/useVideoHandlers';
import { useTheme } from '@/providers/ThemeProvider';
import videoStore from '@/store/videoStore';
import SuspenseVideoList from './SuspenseVideoList';

export default function Home() {
  const { isFormVisible } = videoStore();
  const { handleAddVideo, handleSubmitVideo } = useVideoHandlers();
  const theme = useTheme();

  return (
    <View 
      className="flex-1 bg-gray-50" 
      style={{ backgroundColor: theme.colors.background }}
    >
      <Header title="Video Diary"/>
      
      {isFormVisible ? (
        <MetadataForm
          onSubmit={handleSubmitVideo}
          initialValues={{ title: '', description: '' }}
        />
      ) : (
          <Suspense fallback={<LoadingAnimation isCollection={false} />}>
            <SuspenseVideoList />
          </Suspense>
      )}

      {/* Show Add Video Button only when form is not visible */}
      {!isFormVisible && (
        <FAB
          icon="plus"
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: theme.colors.primary,
            borderRadius: 100,
          }}
          onPress={handleAddVideo}
          color={theme.colors.background}
        />
      )}
    </View>
  );
}