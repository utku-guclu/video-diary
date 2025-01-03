import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Alert } from 'react-native';
import { useEventListener } from 'expo';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useMutation } from '@tanstack/react-query';
import { CropConfig, Video } from '@/types';
import { VideoProcessor } from '@/services/videoProcessor';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';
import { Play, Pause } from 'lucide-react-native';
import VideoTimeline from '../VideoTimeLine';
import useVideoHandlers from '@/hooks/useVideoHandlers';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import constants from '@/constants';
import styles from './styles';

// Constants for dimensions and configurations
const { MAX_DURATION } = constants;

// Component Props interface
interface Props {
    uri: string;
    video: Video;
    onNext: () => void;
}

export default function VideoCropper({ uri, video, onNext }: Props) {
    // Hooks and state and ref initialization
    const theme = useTheme();
    const router = useRouter();
    const playbackRef = useRef({
        currentSegmentTime: 0,
        isPlaying: false
    });
    const { handleCropComplete } = useVideoHandlers();

    // Video state management
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(5);
    const [currentSegmentTime, setCurrentSegmentTime] = useState(0);

    // Initialize video player with frequent updates
    const player = useVideoPlayer(uri, (player) => {
        player.timeUpdateEventInterval = 0.1; // Update every 0.1 seconds
    });

    // Handle video time updates and end of segment
    useEventListener(player, 'timeUpdate', () => {
        if (player.currentTime >= endTime) {
            handlePlaybackEnd();
        } else if (playbackRef.current.isPlaying) {
            const segmentPosition = Math.max(0, Math.min(
                player.currentTime - startTime,
                MAX_DURATION
            ));
            playbackRef.current.currentSegmentTime = segmentPosition;
            setCurrentSegmentTime(segmentPosition);
        }
    });

    // Track segment time during playback
    useEffect(() => {
        if (isPlaying && player.currentTime) {
            const segmentPosition = Math.max(0, Math.min(
                player.currentTime - startTime,
                MAX_DURATION
            ));

            // Only update if the value has changed significantly
            if (Math.abs(segmentPosition - currentSegmentTime) > 0.1) {
                setCurrentSegmentTime(segmentPosition);
            }
        }
    }, [player.currentTime]);

    // Initialize video duration and segment
    useEventListener(player, 'statusChange', (event) => {
        if (event.status === 'readyToPlay' && player.duration) {
            setDuration(player.duration);
            setEndTime(startTime + MAX_DURATION);
        }
    });

    // Handle end of playback
    const handlePlaybackEnd = () => {
        player.pause();
        player.currentTime = startTime;
        setIsPlaying(false);
    };

    // Video cropping mutation
    const cropMutation = useMutation({
        mutationFn: async (config: CropConfig) => {
            console.log('Starting video crop with config:', config);

            // Get cropped video URI
            const croppedUri = await VideoProcessor.cropVideo(uri, {
                crop: {
                    startTime: config.startTime,
                    endTime: config.endTime,
                    duration: config.duration
                }
            });

            console.log('Cropped video URI:', croppedUri);

            if (!croppedUri) {
                throw new Error('Failed to crop video - no output URI received');
            }

            // Handle crop completion
            const result = await handleCropComplete(video, {
                ...config,
                outputUri: croppedUri
            });
            
            console.log('Crop complete, result:', result);
            return result;
        },
        onSuccess: (data) => {
            console.log('Mutation succeeded:', data);
            onNext();
            router.push('/collection');
        },
        onError: (error) => {
            console.error('Crop mutation failed:', error);
            Alert.alert('Error', 'Failed to crop video. Please try again.');
        }
    });

    // Utility function to format time display
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    };

    // Handle timeline selection changes
    const handleSelectionChange = (start: number, end: number) => {
        const adjustedEnd = end > start + MAX_DURATION ? start + MAX_DURATION : end;

        setStartTime(start);
        setEndTime(adjustedEnd);
        player.currentTime = start;

        if (isPlaying) {
            player.play();
        }
    };

    // Toggle video playback
    const togglePlayback = () => {
        const newPlayingState = !isPlaying;
        playbackRef.current.isPlaying = newPlayingState;

        if (newPlayingState) {
            player.currentTime = startTime;
            player.play();
        } else {
            player.pause();
        }
        setIsPlaying(newPlayingState);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Video Preview Section */}
                <View style={styles.videoContainer}>
                    <VideoView
                        player={player}
                        style={styles.video}
                        contentFit="contain"
                        nativeControls={false}
                    />
                </View>

                {/* Video Controls Section */}
                <View style={styles.controlsContainer}>
                    <VideoTimeline
                        uri={uri}
                        duration={duration}
                        onSelectionChange={handleSelectionChange}
                        startTime={startTime}
                        endTime={endTime}
                        currentTime={player.currentTime}
                        isPlaying={isPlaying}
                    />

                    {/* Time Display Section */}
                    <View style={styles.timestampContainer}>
                        <Text style={styles.timestampText}>
                            {formatTime(startTime)}
                        </Text>
                        <Text style={styles.durationText}>
                            {formatTime(isPlaying ? currentSegmentTime : MAX_DURATION)}
                        </Text>
                        <Text style={styles.timestampText}>
                            {formatTime(endTime)}
                        </Text>
                    </View>

                    {/* Control Buttons Section */}
                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={togglePlayback}
                            style={styles.playButton}
                        >
                            {isPlaying ? (
                                <Pause color="white" size={28} />
                            ) : (
                                <Play color="white" size={28} />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => cropMutation.mutate({
                                startTime,
                                endTime,
                                duration: MAX_DURATION // 5 seconds - segment duration
                            })}
                            style={styles.button}
                            disabled={cropMutation.isPending}
                        >
                            <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
                                {cropMutation.isPending ? 'Cropping...' : 'Crop'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

