import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useVideoStore } from '@/hooks/useVideoStore';
import { TabButton } from '@/components/TabButton';
import { useTheme } from '@/providers/ThemeProvider';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { isFormVisible, setFormVisible } = useVideoStore();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingTop: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name={isFormVisible ? "arrow-back" : "home"}
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
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size + 2} color={color} />
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
