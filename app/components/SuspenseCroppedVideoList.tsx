import React from 'react';
import useCroppedVideosQuery from '@/hooks/useVideoQuery';
import { router } from 'expo-router';
import VideoList from './VideoList';
import type { Video } from '@/types';

export default function SuspenseCroppedVideosList() {
  const { data } = useCroppedVideosQuery();
  
  // Safety check for undefined data
  const videos = data ?? [];
  
  const handleVideoPress = (video: Video) => {
    router.push(`/details/${video.id}`);
  };
  
  return (
    <VideoList
      isCollectionTab={true}
      videos={videos}
      onVideoPress={handleVideoPress}
    />
  );
}
