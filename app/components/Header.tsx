import React from 'react';
import { View, Text } from 'react-native';

export default function Header() {
  return (
    <View className="p-6 bg-white shadow-sm">
      <Text className="text-3xl font-bold text-blue-600">
        Video Diary
      </Text>
    </View>
  );
}
