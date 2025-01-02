import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';
import { View, Text } from 'react-native';

export default function Header({ title }: { title: string }) {
  const theme = useTheme();

  return (
    <View className="p-6 bg-white shadow-sm">
      <Text className="text-3xl font-bold text-blue-600" style={{ color: theme.colors.primary }}>
        {title}
      </Text>
    </View>
  );
}
