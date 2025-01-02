import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useVideoStore } from '@/hooks/useVideoStore';
import { TabButton } from '@/components/TabButton';
import { useTheme } from '@/providers/ThemeProvider';
import { createTabScreenOptions } from '@/components/TabScreenOptions';

export default function TabLayout() {
  const { isFormVisible, setFormVisible } = useVideoStore();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={createTabScreenOptions(theme)}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name={isFormVisible ? "arrow-back" : "video-library"}
              size={size + 2}
              color={color}
            />
          ),
          tabBarButton: (props) => (
            <TabButton
              isFormVisible={isFormVisible}
              setFormVisible={setFormVisible}
              onPress={props.onPress}
              style={props.style}
            >
              {props.children}
            </TabButton>
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="video-stable" size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size + 2} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
