import { View } from 'react-native';
import loadingHomeAnimation from '../../assets/animations/loading-home-animation.json';
import loadingCollectionAnimation from '../../assets/animations/loading-collection-animation.json';
import LottieView from 'lottie-react-native';
import React from 'react';

export default function LoadingAnimation({ children, isCollection}: { children?: React.ReactNode, isCollection?: boolean }) {
    return (
        <View className="flex-1 items-center justify-center">
            <LottieView
                source={isCollection ? loadingCollectionAnimation : loadingHomeAnimation}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
            />
            {children}
        </View>
    );
}