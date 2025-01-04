import React from 'react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { View, Text, TouchableOpacity } from 'react-native';
import SuspenseCroppedVideosList from './SuspenseCroppedVideoList';
import LoadingAnimation from './LoadingAnimation';

function CroppedVideosList() {
  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <View className="flex-1 items-center justify-center">
          <Text>Failed to load videos</Text>
          <TouchableOpacity 
            onPress={resetErrorBoundary}
            className="mt-4 p-2 bg-blue-500 rounded-lg"
          >
            <Text className="text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <Suspense fallback={<LoadingAnimation isCollection={false} />}>
        <SuspenseCroppedVideosList />
      </Suspense>
    </ErrorBoundary>
  );
}

export default CroppedVideosList;