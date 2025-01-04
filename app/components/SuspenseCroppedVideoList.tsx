import React from 'react';
import useCroppedVideosQuery from '@/hooks/useCroppedVideoQuery';
import { router } from 'expo-router';
import VideoList from './VideoList';
import type { Video } from '@/types';
import { ActivityIndicator, View } from 'react-native';

export default function SuspenseCroppedVideosList() {
    const { data, isLoading } = useCroppedVideosQuery();

    // Safety check for undefined data
    const croppedVideos = data ?? [];

    const handleVideoPress = (video: Video) => {
        router.push(`/details/${video.id}`);
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <VideoList
            isCollectionTab={true}
            videos={croppedVideos}
            onVideoPress={handleVideoPress}
        />
    );
}
