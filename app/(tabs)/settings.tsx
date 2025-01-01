import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import useVideoHandlers from '@/hooks/useVideoHandlers';

export default function Settings() {
  const { colorScheme, toggleTheme } = useThemeStore();
  const { handleDeleteVideos } = useVideoHandlers();

  return (
    <View>
      <TouchableOpacity
        className="flex-row w-full items-center justify-between bg-gray-200 p-4 rounded-lg"
        onPress={toggleTheme}
      >
        <Text>
          Theme
        </Text>
        <Text >
          {colorScheme === 'light' ? 'Light ☀️' : 'Dark 🌙'}
        </Text>
      </TouchableOpacity>

      {/* Delete Videos */}
      <TouchableOpacity
      className='flex-row w-full items-center justify-between bg-gray-200 p-4 rounded-lg'
        onPress={handleDeleteVideos}
      >
        <Text>Delete All Videos</Text>
      </TouchableOpacity>
    </View>
  );
}

