import React from 'react';
import { View, Modal, TouchableOpacity, Text } from 'react-native';
import { Video } from '@/types';

import CustomButton from '@/components/CustomButton';
import VideoCropper from '@/components/VideoCropper';

interface Props {
    visible: boolean;
    video: Video;
    onClose: () => void;
}

export default function CropVideoModal({ visible, video, onClose }: Props) {
    return (
        <Modal visible={visible} animationType="slide">
            <View className="flex-1 bg-white">
              <CustomButton text="Close" onClose={onClose} />
              
                <VideoCropper
                    uri={video.uri}
                    video={video}
                    onNext={onClose}
                />
            </View>
        </Modal>
    );
}
