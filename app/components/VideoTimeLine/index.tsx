import React, { useEffect } from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
    withSpring,
    withTiming,
    Easing,
} from 'react-native-reanimated';

import constants from '@/constants';
import styles from './styles';

// Constants for dimensions and configurations
const { MAX_DURATION, ACTIVE_AREA_WIDTH } = constants;

// Animation configurations
const SPRING_CONFIG = {
    damping: 20,
    stiffness: 10,
    mass: 1.5,
};

// Component Props interface
interface Props {
    uri: string;
    duration: number;
    onSelectionChange: (start: number, end: number) => void;
    startTime: number;
    endTime: number;
    currentTime: number;
    isPlaying: boolean;
}

export default function VideoTimeline({
    uri,
    duration,
    onSelectionChange,
    startTime,
    endTime,
    currentTime,
    isPlaying
}: Props) {
    // Animated values initialization
    const position = useSharedValue(0);
    const timeIndicator = useSharedValue(0);
    const segmentWidth = Math.min((MAX_DURATION / duration) * ACTIVE_AREA_WIDTH, ACTIVE_AREA_WIDTH);

    // Update the time indicator animation with proper timing
    useEffect(() => {
        if (duration > 0 && isPlaying) {
            const relativePosition = currentTime - startTime;
            const progress = (relativePosition / MAX_DURATION) * segmentWidth;
            const remainingDuration = (endTime - currentTime) * 1000;
    
            timeIndicator.value = withTiming(progress, {
                duration: remainingDuration,
                easing: Easing.linear
            });
        } else {
            timeIndicator.value = withTiming(0, {
                duration: 300,
                easing: Easing.linear
            });
        }
    }, [isPlaying, currentTime, startTime, endTime, duration, segmentWidth]);

    // Time indicator animation
    useEffect(() => {
        if (duration > 0 && isPlaying) {
            // Calculate relative position within the segment
            const relativePosition = currentTime - startTime;
            // Calculate progress as a percentage of segment width
            const progress = (relativePosition / MAX_DURATION) * segmentWidth;

            // Calculate remaining duration for the animation
            const remainingDuration = (endTime - currentTime) * 1000;

            timeIndicator.value = withTiming(
                progress,
                {
                    duration: remainingDuration,
                    easing: Easing.linear
                }
            );
        } else {
            // Reset indicator when not playing
            timeIndicator.value = 0;
        }
    }, [isPlaying, currentTime, startTime, endTime, duration, segmentWidth]);

    // Update the animated style
    const indicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: timeIndicator.value }],
        opacity: isPlaying ? 1 : 0,
        left: 0, // Ensure indicator starts from the left edge
    }));

    // Pan gesture handler for segment selection
    const panGesture = Gesture.Pan()
        .minDistance(MAX_DURATION)
        .onUpdate((event) => {
            const maxPosition = ACTIVE_AREA_WIDTH - segmentWidth;
            const newPosition = Math.max(0, Math.min(
                position.value + event.translationX,
                maxPosition
            ));

            position.value = newPosition;

            const newStartTime = (newPosition / ACTIVE_AREA_WIDTH) * duration;
            const newEndTime = Math.min(newStartTime + MAX_DURATION, duration);

            runOnJS(onSelectionChange)(newStartTime, newEndTime);
        })
        .onEnd(() => {
            position.value = withSpring(position.value, SPRING_CONFIG);
        });

    // Animated styles for selection and time indicator
    const selectionStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value }],
        width: segmentWidth,
    }));

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Video thumbnail background */}
                <Image
                    source={{ uri }}
                    style={styles.thumbnail}
                    resizeMode="cover" />
                {/* Dark overlay */}
                <View style={styles.overlay} />

                {/* Draggable selection segment */}
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[styles.selection, selectionStyle]}>
                        {/* Time progress indicator */}
                        <Animated.View style={[styles.timeIndicator, indicatorStyle]} />
                    </Animated.View>
                </GestureDetector>
            </View>
        </GestureHandlerRootView>
    );
}

