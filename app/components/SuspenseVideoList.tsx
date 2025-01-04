import React from 'react';
import useVideoQuery from '@/hooks/useVideoQuery';
import VideoList from './VideoList';
import { router } from 'expo-router';
import type { Video } from '@/types';

export default function SuspenseVideoList() {
    const { data } = useVideoQuery();

    // Safety check for undefined data
    const videos = data ?? [];

    const handleVideoPress = (video: Video) => {
        router.push(`/details/${video.id}`);
    };

    return (
        <VideoList
            isCollectionTab={false}
            videos={videos}
            onVideoPress={handleVideoPress}
        />
    );
}

