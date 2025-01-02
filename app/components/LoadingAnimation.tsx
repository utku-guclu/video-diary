import { View } from 'react-native';
import loadingAnimation from '../../assets/animations/loading-animation.json';
import loadingProfileAnimation from '../../assets/animations/loading-profile-animation.json';
import LottieView from 'lottie-react-native';
import React from 'react';

export default function LoadingAnimation({ children, isProfile }: { children?: React.ReactNode, isProfile?: boolean }) {
    return (
        <View className="flex-1 items-center justify-center">
            <LottieView
                source={isProfile ? loadingProfileAnimation : loadingAnimation}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
            />
            {children}
        </View>
    );
}