import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Alert } from 'react-native';
import { useEventListener } from 'expo';
import { VideoView, useVideoPlayer, VideoPlayerStatus } from 'expo-video';
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
import LoadingAnimation from '../LoadingAnimation';

// Constants for dimensions and configurations
const { MAX_DURATION } = constants;

// Component Props interface
interface Props {
    uri: string;
    video: Video;
    onNext: () => void;
    onCropStart: () => void;
}

export default function VideoCropper({ uri, video, onNext, onCropStart }: Props) {
    // Hooks and state and ref initialization
    const theme = useTheme();
    const router = useRouter();
    const { handleCropComplete } = useVideoHandlers();

    // State management with better type safety
    const [videoState, setVideoState] = useState({
        duration: 0,
        isPlaying: false,
        startTime: 0,
        endTime: 5,
        currentSegmentTime: 0,
        isLoading: true
    });

    // Refs for values needed in event listeners
    const stateRef = useRef(videoState);
    stateRef.current = videoState;

    // Initialize video player with frequent updates
    const player = useVideoPlayer(uri, (player) => {
        player.timeUpdateEventInterval = 0.1; // Update every 0.1 seconds
    });

    // Memoized handlers for better performance
    const handlePlaybackEnd = useCallback(() => {
        try {
            player.pause();
            player.currentTime = videoState.startTime;
            setVideoState(prev => ({ ...prev, isPlaying: false }));
        } catch (error) {
            console.error('Error handling playback end:', error);
        }
    }, [videoState.startTime]);

    const handleTimeUpdate = useCallback(() => {
        try {
            const currentPosition = player.currentTime;

            // If we've reached the end time, loop back to start time
            if (currentPosition >= videoState.endTime) {
                player.currentTime = videoState.startTime;
                setVideoState(prev => ({
                    ...prev,
                    currentSegmentTime: 0
                }));
                return;
            }

            // If we're before start time, seek to start
            if (currentPosition < videoState.startTime) {
                player.currentTime = videoState.startTime;
            }

            if (videoState.isPlaying) {
                const segmentPosition = Math.max(0, Math.min(
                    currentPosition - videoState.startTime,
                    videoState.endTime - videoState.startTime
                ));

                setVideoState(prev => ({
                    ...prev,
                    currentSegmentTime: segmentPosition
                }));
            }
        } catch (error) {
            console.error('Error handling time update:', error);
        }
    }, [videoState.startTime, videoState.endTime, videoState.isPlaying]);

    const handleSelectionChange = useCallback((start: number, end: number) => {
        try {
            const adjustedEnd = Math.min(end, start + MAX_DURATION);
            player.currentTime = start;

            setVideoState(prev => ({
                ...prev,
                startTime: start,
                endTime: adjustedEnd
            }));

            if (videoState.isPlaying) {
                player.play();
            }
        } catch (error) {
            console.error('Error handling selection change:', error);
        }
    }, [videoState.isPlaying]);

    // Event listeners with error handling
    useEventListener(player, 'timeUpdate', handleTimeUpdate);

    useEventListener(player, 'statusChange', (event) => {
        try {
            if (event.status === 'readyToPlay' && player.duration) {
                setVideoState(prev => ({
                    ...prev,
                    duration: player.duration,
                    endTime: prev.startTime + MAX_DURATION,
                    isLoading: false
                }));
            } else if (event.status === 'error') {
                console.error('Video player error:', event.error);
                Alert.alert('Error', 'Failed to play video');
                setVideoState(prev => ({
                    ...prev,
                    isLoading: false
                }));
            }
        } catch (error) {
            console.error('Error handling status change:', error);
            setVideoState(prev => ({ ...prev, isLoading: false }));
        }
    });

    // When displaying the video, we can check the metadata to ensure we're only showing the trimmed portion
    useEffect(() => {
        async function loadMetadata() {
            const metadata = await VideoProcessor.getVideoMetadata(uri);
            if (metadata) {
                setVideoState(prev => ({
                    ...prev,
                    startTime: metadata.startTime,
                    endTime: metadata.endTime,
                    duration: metadata.duration
                }));

                // Ensure we start at the correct position
                if (player.currentTime < metadata.startTime ||
                    player.currentTime > metadata.endTime) {
                    player.currentTime = metadata.startTime;
                }
            }
        }

        loadMetadata();
    }, [uri]);

    // Crop mutation with enhanced error handling
    const cropMutation = useMutation({
        mutationFn: async (config: CropConfig) => {
            try {
                onCropStart(); // Starting crop
                console.log('Starting video crop with config:', config);

                if (!uri) {
                    throw new Error('No video URI provided');
                }

                const croppedUri = await VideoProcessor.cropVideo(uri, {
                    crop: {
                        startTime: config.startTime,
                        endTime: config.endTime,
                        duration: config.duration
                    }
                });

                if (!croppedUri) {
                    throw new Error('No output URI received from video processor');
                }

                return await handleCropComplete(video, {
                    ...config,
                    outputUri: croppedUri
                });
            } catch (error) {
                console.error('Crop mutation error:', error);
                throw error;
            }
        },
        onSuccess: (data) => {
            console.log('Crop successful:', data);
            onNext();
            router.push('/collection');
        },
        onError: (error) => {
            console.error('Crop failed:', error);
            Alert.alert(
                'Error',
                'Failed to crop video. Please try again.',
                [{ text: 'OK' }]
            );
        }
    });

    // Toggle video playback
    const togglePlayback = useCallback(() => {
        try {
            const newPlayingState = !videoState.isPlaying;

            if (newPlayingState) {
                // If we're past the end time, start from beginning
                if (player.currentTime >= videoState.endTime) {
                    player.currentTime = videoState.startTime;
                }
                // If we're before the start time, move to start
                else if (player.currentTime < videoState.startTime) {
                    player.currentTime = videoState.startTime;
                }
                player.play();
            } else {
                player.pause();
            }

            setVideoState(prev => ({
                ...prev,
                isPlaying: newPlayingState
            }));
        } catch (error) {
            console.error('Error toggling playback:', error);
            Alert.alert('Error', 'Failed to control video playback');
        }
    }, [videoState.isPlaying, videoState.startTime, videoState.endTime, player]);

    // Utility function to format time display
    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }, []);

    // Loading indicator
    if (videoState.isLoading) {
        return (
            <View style={styles.container}>
                <LoadingAnimation />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
            <View style={styles.videoContainer}>
                <VideoView
                    player={player}
                    style={styles.video}
                    contentFit="contain"
                    nativeControls={false}
                />
            </View>

            <View style={styles.controlsContainer}>
                {/* Timeline Section */}
                <VideoTimeline
                    uri={uri}
                    duration={videoState.duration}
                    onSelectionChange={handleSelectionChange}
                    startTime={videoState.startTime}
                    endTime={videoState.endTime}
                    currentTime={player.currentTime}
                    isPlaying={videoState.isPlaying}
                />

                {/* Time Display Section */}
                <View style={styles.timestampContainer}>
                    <Text style={styles.timestampText}>
                        {formatTime(videoState.startTime)}
                    </Text>
                    <Text style={styles.durationText}>
                        {formatTime(videoState.isPlaying ? videoState.currentSegmentTime : MAX_DURATION)}
                    </Text>
                    <Text style={styles.timestampText}>
                        {formatTime(videoState.endTime)}
                    </Text>
                </View>

                {/* Control Buttons Section */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[
                            styles.button,
                            cropMutation.isPending && styles.buttonDisabled
                        ]}
                        disabled={cropMutation.isPending}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={togglePlayback}
                        style={[
                            styles.playButton,
                            cropMutation.isPending && styles.buttonDisabled
                        ]}
                        disabled={videoState.isLoading || cropMutation.isPending}
                    >
                        {videoState.isPlaying ? (
                            <Pause color="white" size={28} />
                        ) : (
                            <Play color="white" size={28} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => cropMutation.mutate({
                            startTime: videoState.startTime,
                            endTime: videoState.endTime,
                            duration: MAX_DURATION
                        })}
                        style={[
                            styles.button,
                            cropMutation.isPending && styles.buttonDisabled
                        ]}
                        disabled={cropMutation.isPending || videoState.isLoading}
                    >
                        <Text style={[
                            styles.buttonText,
                            { color: theme.colors.primary }
                        ]}>
                            {cropMutation.isPending ? 'Cropping...' : 'Crop'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </GestureHandlerRootView>
    );
}

