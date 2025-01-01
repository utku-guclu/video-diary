import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { lightTheme, darkTheme } from '../theme';

export default function Settings() {
  const { colorScheme, toggleTheme } = useThemeStore();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <View className=''>
      <TouchableOpacity 
        className="flex-row w-full items-center justify-between bg-gray-200 p-4 rounded-lg"
        onPress={toggleTheme}
      >
        <Text>
          Theme
        </Text>
        <Text >
          {colorScheme === 'light' ? 'Light ☀️': 'Dark 🌙'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

