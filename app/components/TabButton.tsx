import { Pressable, GestureResponderEvent } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

interface TabButtonProps {
  setFormVisible: (visible: boolean) => void;
  onPress?: (event: GestureResponderEvent) => void;
  isFormVisible: boolean;
  style?: any;
  children: React.ReactNode;
}

export const TabButton = ({ 
  isFormVisible, 
  setFormVisible, 
  onPress, 
  style, 
  children 
}: TabButtonProps) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={(event) => {
        if (isFormVisible) {
          setFormVisible(false);
          router.push('/');
        } else {
          onPress?.(event);
        }
      }}
      style={style}
    >
      {children}
    </Pressable>
  );
};

export default TabButton;