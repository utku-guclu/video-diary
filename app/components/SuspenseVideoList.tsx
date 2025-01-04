import React from 'react';
import useVideoQuery from '@/hooks/useVideoQuery';
import VideoList from './VideoList';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import type { Video } from '@/types';

export default function SuspenseVideoList() {
    const { data, isLoading } = useVideoQuery();

    // Safety check for undefined data
    const videos = data ?? [];
    
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
            isCollectionTab={false}
            videos={videos}
            onVideoPress={handleVideoPress}
        />
    );
}
