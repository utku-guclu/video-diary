import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import Header from '@/components/Header';
import useVideoHandlers from '@/hooks/useVideoHandlers';
import useVideoStore from '@/hooks/useVideoStore';

export default function Settings() {
  const theme = useTheme();
  const { colorScheme, toggleTheme } = useThemeStore();
  const { handleDeleteVideos } = useVideoHandlers();
  const { videos } = useVideoStore();

  const hasVideos = videos.length > 0;

  return (
    <View className="p-4 space-y-4 h-full" style={{ backgroundColor: theme.colors.background }}>
      <Header title="Preferences" />

      <View className="space-y-2 gap-4 flex-1">
        {/* Theme Mode */}
        <TouchableOpacity
          className="flex-row items-center justify-between p-4 rounded-xl"
          style={{ backgroundColor: theme.colors.surface }}
          onPress={toggleTheme}
        >
          <View className="flex-row items-center space-x-3 gap-2">
            <Ionicons
              name={colorScheme === 'light' ? 'sunny' : 'moon'}
              size={24}
              color={theme.colors.primary}
            />
            <Text style={{ color: theme.colors.text }}>Theme Mode</Text>
          </View>
          <Text style={{ color: theme.colors.muted }}>
            {colorScheme === 'light' ? 'Light' : 'Dark'}
          </Text>
        </TouchableOpacity>

        {/* Delete All Videos */}
        <TouchableOpacity
          className="flex-row items-center justify-between p-4 rounded-xl"
          style={{ 
            backgroundColor: `${theme.colors.error}15`,
            opacity: hasVideos ? 1 : 0.5 
          }}
          onPress={handleDeleteVideos}
          disabled={!hasVideos}
        >
          <View className="flex-row items-center space-x-3">
            <Ionicons
              name="trash"
              size={24}
              color={theme.colors.error}
            />
            <Text style={{ color: theme.colors.error }}>
              {hasVideos ? 'Delete All Videos' : 'No Videos to Delete'}
            </Text>
          </View>
          {hasVideos && (
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.colors.error}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
