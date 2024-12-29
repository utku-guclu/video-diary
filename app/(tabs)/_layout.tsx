import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useVideoStore } from '@/hooks/useVideoStore';
import { TabButton } from '@/components/TabButton';

export default function TabLayout() {
  {/* Hooks */ }
  const {
    isFormVisible,
    setFormVisible,
  } = useVideoStore();
  return (
    <Tabs>
     <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name={isFormVisible ? "arrow-back" : "home"}
              size={size}
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
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
