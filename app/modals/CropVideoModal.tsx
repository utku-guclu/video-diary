import React from 'react';
import { View, Modal, TouchableOpacity, Text } from 'react-native';
import VideoCropper from '@/components/VideoCropper';
import { Video, CropConfig } from '@/types';

interface Props {
    visible: boolean;
    video: Video;
    onClose: () => void;
    onCropComplete: (video: Video, cropConfig: CropConfig) => void;
}

export default function CropVideoModal({ visible, video, onClose, onCropComplete }: Props) {
    return (
        <Modal visible={visible} animationType="slide">
            <View className="flex-1 bg-white">
                <VideoCropper
                    uri={video.uri}
                    onCropComplete={(cropConfig) => {
                        onCropComplete(video, cropConfig);
                        onClose();
                    }}
                />
                <TouchableOpacity onPress={onClose} className="p-4">
                    <Text>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}
