import React, { useState, useEffect, Suspense } from 'react';
import { View, Text, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import VideoItem from './VideoItem';
import { Video } from '../types';
import useVideoStore from '@/hooks/useVideoStore';
import EditVideoModal from '@/modals/EditVideoModal';
import CropVideoModal from '@/modals/CropVideoModal';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { VideoSkeleton } from './VideoSkeleton';

interface Props {
    videos: Video[];
    isProfileTab: boolean;
    onVideoPress: (video: Video) => void;
}

interface VideoListContentProps extends Props {
    onDelete: (video: Video) => void;
    onEdit: (video: Video) => void;
    onCrop: (video: Video) => void;
}

const VideoListContent = ({
    videos,
    onVideoPress,
    isProfileTab,
    onDelete,
    onEdit,
    onCrop
}: VideoListContentProps) => (
    <FlashList
        data={videos}
        renderItem={({ item }) => (
            <VideoItem
                video={item}
                onPress={() => onVideoPress(item)}
                onDelete={() => onDelete(item)}
                onEdit={() => onEdit(item)}
                onCrop={() => onCrop(item)}
            />
        )}
        estimatedItemSize={100}
        ListEmptyComponent={
            <EmptyState isProfileTab={isProfileTab} />
        }
        contentContainerStyle={{ paddingHorizontal: 16 }}
    />
);

const EmptyState = ({ isProfileTab }: { isProfileTab: boolean }) => {
    const theme = useTheme();
    return (
        <View className="flex-1 items-center justify-center p-8">
            <Ionicons
                name={isProfileTab ? "videocam-outline" : "add-circle-outline"}
                size={64}
                color={theme.colors.muted}
                style={{ marginBottom: 20 }}
            />
            <Text style={{ color: theme.colors.text }}>
                {isProfileTab ? "Your Video Diary" : "Your Video Collection"}
            </Text>
        </View>
    );
};

export default function VideoList({ videos, onVideoPress, isProfileTab }: Props) {
    const theme = useTheme();
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

    return (
        <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
            <Suspense fallback={<VideoSkeleton count={3} />}>
                <VideoListContent
                    videos={videos}
                    onVideoPress={onVideoPress}
                    isProfileTab={isProfileTab}
                    onDelete={handleDelete}
                    onEdit={(video) => {
                        setSelectedVideo(video);
                        setIsEditModalVisible(true);
                    }}
                    onCrop={(video) => {
                        setSelectedVideo(video);
                        setIsCropModalVisible(true);
                    }}
                />
            </Suspense>
            
            {/* If a video is selected, show the edit and crop modals */}
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
                    />
                </>
            )}
        </View>
    );
}