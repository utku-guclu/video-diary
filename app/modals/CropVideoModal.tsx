import React from 'react';
import { View, Modal, TouchableOpacity, Text } from 'react-native';
import VideoCropper from '@/components/VideoCropper';
import { Video } from '@/types';

interface Props {
    visible: boolean;
    video: Video;
    onClose: () => void;
}

export default function CropVideoModal({ visible, video, onClose }: Props) {
    return (
        <Modal visible={visible} animationType="slide">
            <View className="flex-1 bg-white">
                <VideoCropper
                    uri={video.uri}
                    video={video}
                    onNext={onClose}
                />
                <TouchableOpacity onPress={onClose} className="p-4">
                    <Text>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}
