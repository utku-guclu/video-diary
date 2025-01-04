import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Video } from '@/types';
import { BlurView } from 'expo-blur';
import VideoCropper from '@/components/VideoCropper';
import LoadingAnimation from '@/components/LoadingAnimation';

interface Props {
    visible: boolean;
    video: Video;
    onClose: () => void;
}

export default function CropVideoModal({ visible, video, onClose }: Props) {
    const [isCropping, setIsCropping] = useState(false);

    const handleCropStart = () => {
        setIsCropping(true);
    };

    const handleCropComplete = () => {
        setIsCropping(false);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide">
            <View className="flex-1 bg-white relative">
                <VideoCropper
                    uri={video.uri}
                    video={video}
                    onNext={handleCropComplete}
                    onCropStart={handleCropStart}
                />
                
                {/* Loading Overlay */}
                {isCropping && (
                    <BlurView 
                        intensity={100}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <View className="items-center">
                            <LoadingAnimation isCollection={true} />
                        </View>
                    </BlurView>
                )}
            </View>
        </Modal>
    );
}