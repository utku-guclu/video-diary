import { useLocalSearchParams } from 'expo-router';
import VideoDetails  from '../components/VideoDetails';
import React from 'react';

export default function Details() {
  const { id } = useLocalSearchParams();
  return <VideoDetails id={id} />;
}
