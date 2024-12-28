import { View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import VideoItem from './VideoItem';
import { Video } from '../types';
import React from 'react';

interface Props {
    videos: Video[];
    onVideoPress: (video: Video) => void;
}

export default function VideoList({ videos, onVideoPress }: Props) {
    return (
        <FlashList
            data={videos}
            renderItem={({ item }) => (
                <VideoItem video={item} onPress={() => onVideoPress(item)} />
            )}
            estimatedItemSize={100}
            ListEmptyComponent={
                <View className="flex-1 items-center justify-center p-8">
                    <Text className="text-2xl font-semibold text-gray-800 mb-2">
                        Your Video Collection
                    </Text>
                    <Text className="text-gray-500 text-center text-lg">
                        No videos yet. Start by adding one!
                    </Text>
                </View>
            }
        />
    );
}
