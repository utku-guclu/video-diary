import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Slider from '@react-native-community/slider';
import { CropConfig } from '@/types';

interface Props {
    uri: string;
    onCropComplete: (config: CropConfig) => void;
}

export default function VideoCropper({ uri, onCropComplete }: Props) {
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(5);
    
    return (
        <View className="flex-1">
            <Video
                source={{ uri }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                className="w-full h-64"
            />
            <View className="p-4">
                <Slider
                    minimumValue={0}
                    maximumValue={30}
                    value={startTime}
                    onValueChange={setStartTime}
                />
                <Text>Selected: {startTime}s - {endTime}s</Text>
            </View>
        </View>
    );
}
