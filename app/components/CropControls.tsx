import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Button } from '@rneui/themed';

interface CropControlsProps {
  duration: number;
  onCropSelect: (start: number, end: number) => void;
  onNext: () => void;
}

export function CropControls({ duration, onCropSelect, onNext }: CropControlsProps) {
  const [startTime, setStartTime] = useState(0);
  const SEGMENT_DURATION = 5; // 5 seconds segment

  const handleSliderChange = (value: number) => {
    const start = Math.max(0, value);
    const end = Math.min(duration, start + SEGMENT_DURATION);
    setStartTime(start);
    onCropSelect(start, end);
  };

  return (
    <View className="p-4 bg-white rounded-lg shadow-md">
      <Text className="text-lg font-semibold mb-4">
        Select 5-second segment
      </Text>
      <Slider
        value={startTime}
        onValueChange={handleSliderChange}
        minimumValue={0}
        maximumValue={Math.max(0, duration - SEGMENT_DURATION)}
        step={0.1}
        className="w-full h-12"
      />
      <View className="flex-row justify-between mb-4">
        <Text className="text-gray-600">
          Start: {startTime.toFixed(1)}s
        </Text>
        <Text className="text-gray-600">
          End: {Math.min(duration, startTime + SEGMENT_DURATION).toFixed(1)}s
        </Text>
      </View>
      <Button
        title="Next"
        onPress={onNext}
        className="bg-primary rounded-lg"
      />
    </View>
  );
}

