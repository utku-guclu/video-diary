import { View, Text, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import VideoItem from './VideoItem';
import { Video } from '../types';
import React from 'react';
import useVideoStore from '@/hooks/useVideoStore';

interface Props {
    videos: Video[];
    onVideoPress: (video: Video) => void;
}

export default function VideoList({ videos, onVideoPress }: Props) {
    const { deleteVideo, updateVideo } = useVideoStore();

    const handleDelete = (video: Video) => {
        Alert.alert(
            "Delete Video",
            "Are you sure you want to delete this video?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteVideo(video.id)
                }
            ]
        );
    };

    const handleEdit = (video: Video) => {
        // Todo: Implement edit logic here
        // For example, opening a modal with form
        Alert.prompt(
            "Edit Video Title",
            "Enter new title",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Update",
                    onPress: (newTitle?: string) => {
                        if (newTitle) {
                            updateVideo(video.id, { title: newTitle });
                        }
                    }
                }
            ],
            "plain-text",
            video.title
        );
    };

    return (
        <FlashList
            data={videos}
            renderItem={({ item }) => (
                <VideoItem 
                    video={item} 
                    onPress={() => onVideoPress(item)} 
                    onDelete={() => handleDelete(item)}
                    onEdit={() => handleEdit(item)} 
                />
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
