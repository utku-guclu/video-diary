import React, { Suspense } from 'react';
import { View } from 'react-native';
import CroppedVideosList from '@/components/CroppedVideoList';
import LoadingAnimation from '@/components/LoadingAnimation';
import Header from '@/components/Header';
import { useTheme } from '@/providers/ThemeProvider';

export default function Collection() {
  const theme = useTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Video Collection" />
        <Suspense fallback={<LoadingAnimation isCollection={true} />}>
          <CroppedVideosList />
        </Suspense>
    </View>
  );
}