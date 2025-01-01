import { Suspense, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useVideoStore } from '@/hooks/useVideoStore';
import VideoList from '@/components/VideoList';
import React from 'react';
import { router } from 'expo-router';

function CroppedVideosList() {
  const { croppedVideos, loadCroppedVideos } = useVideoStore();

  useEffect(() => {
    loadCroppedVideos();
  }, []);

  return (
    <VideoList 
      videos={croppedVideos}
      onVideoPress={(video) => {
        router.push(`/details/${video.id}`);
      }}
    />
  );
}

export default function Profile() {
  return (
    <View style={{ flex: 1 }}>
      <Suspense fallback={<Text>Loading videos...</Text>}>
        <CroppedVideosList />
      </Suspense>
    </View>
  );
}
