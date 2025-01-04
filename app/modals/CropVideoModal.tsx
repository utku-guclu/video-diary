import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Video } from '@/types';
import { BlurView } from 'expo-blur';
import VideoCropper from '@/components/VideoCropper';
import LottieView from 'lottie-react-native';
import LoadingHomeAnimation from '../../assets/animations/loading-home-animation.json';

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
                            <LottieView
                                source={LoadingHomeAnimation}
                                autoPlay
                                loop
                                style={{ width: 200, height: 200 }}
                            />
                            <Text className="text-lg font-medium mt-4">
                                Cropping video...
                            </Text>
                        </View>
                    </BlurView>
                )}
            </View>
        </Modal>
    );
}