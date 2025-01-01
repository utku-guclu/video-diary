import { View, Text, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import VideoItem from './VideoItem';
import { Video } from '../types';
import React, { useState } from 'react';
import useVideoStore from '@/hooks/useVideoStore';

import EditVideoModal from '@/modals/EditVideoModal';
import CropVideoModal from '@/modals/CropVideoModal';

interface Props {
    videos: Video[];
    onVideoPress: (video: Video) => void;
}

export default function VideoList({ videos, onVideoPress }: Props) {
    const { deleteVideo, updateVideo } = useVideoStore();

    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isCropModalVisible, setIsCropModalVisible] = useState(false);

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
        setSelectedVideo(video);
        setIsEditModalVisible(true);
    };

    const handleCrop = (video: Video) => {
        setSelectedVideo(video);
        setIsCropModalVisible(true);
    };
    return (
           <>
        <FlashList
            data={videos}
            renderItem={({ item }) => (
                <VideoItem 
                    video={item} 
                    onPress={() => onVideoPress(item)} 
                    onDelete={() => handleDelete(item)}
                    onEdit={() => handleEdit(item)} 
                    onCrop={() => handleCrop(item)}
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
                {selectedVideo && (
                <>
                    <EditVideoModal
                        visible={isEditModalVisible}
                        video={selectedVideo}
                        onClose={() => {
                            setIsEditModalVisible(false);
                            setSelectedVideo(null);
                        }}
                        onSave={(updatedVideo) => {
                            updateVideo(selectedVideo.id, updatedVideo);
                            setIsEditModalVisible(false);
                            setSelectedVideo(null);
                        }}
                    />

                    <CropVideoModal
                        visible={isCropModalVisible}
                        video={selectedVideo}
                        onClose={() => {
                            setIsCropModalVisible(false);
                            setSelectedVideo(null);
                        }}
                        onCropComplete={(video, cropConfig) => {
                            // Handle crop completion
                            updateVideo(video.id, cropConfig);
                            setIsCropModalVisible(false);
                            setSelectedVideo(null);
                        }}
                    />
                </>
            )}
        </>
    );
}
