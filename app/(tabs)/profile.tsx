import { Suspense } from 'react';
import { View, Text } from 'react-native';
import React from 'react';
import CroppedVideosList from '@/components/CroppedVideoList';

export default function Profile() {
  return (
    <View style={{ flex: 1 }}>
      <Suspense fallback={<Text>Loading videos...</Text>}>
        <CroppedVideosList />
      </Suspense>
    </View>
  );
}
