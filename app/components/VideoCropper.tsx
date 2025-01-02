import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useEventListener } from 'expo';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useMutation } from '@tanstack/react-query';
import { CropConfig, Video } from '@/types';
import { VideoProcessor } from '@/services/videoProcessor';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import useVideoHandlers from '@/hooks/useVideoHandlers';
import { useTheme } from '@/providers/ThemeProvider';
import { ActivityIndicator } from 'react-native';

interface Props {
    uri: string;
    video: Video;
    onNext: () => void;
}

export default function VideoCropper({ uri, video, onNext }: Props) {
    const theme = useTheme();
    const [duration, setDuration] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(5);
    const [currentTime, setCurrentTime] = useState(0);
    const router = useRouter();
    const { handleCropComplete } = useVideoHandlers();

    const player = useVideoPlayer(uri, (player) => {
        player.timeUpdateEventInterval = 0.5;
    });

    useEventListener(player, 'timeUpdate', (event) => {
        setCurrentTime(event.currentTime);
    });

    useEventListener(player, 'statusChange', (event) => {
        if (event.status === 'readyToPlay' && player.duration) {
            setDuration(player.duration);
        }
    });

    const cropMutation = useMutation({
        mutationFn: async (config: CropConfig) => {
            const croppedUri = await VideoProcessor.cropVideo(uri, {
                crop: {
                    startTime: config.startTime,
                    endTime: config.endTime,
                    duration: config.duration
                }
            });
            return handleCropComplete(video, {
                ...config,
                outputUri: croppedUri
            });
        },
        onSuccess: (newVideo) => {
            Alert.alert("Success", "Video cropped successfully!", [
                { text: "OK", onPress: () => {
                    onNext();
                    router.push('/profile');
                }}
            ]);
        },
        onError: (error) => {
            console.error("Error cropping video:", error);
            Alert.alert("Error", "Failed to crop video. Please try again.");
        }
    });

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSliderChange = async (value: number) => {
        setStartTime(value);
        setEndTime(Math.min(value + 5, duration));
        player.currentTime = value;
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <VideoView
                player={player}
                style={{ width: '100%', height: 256 }}
                contentFit="contain"
                nativeControls={false}
            />

            <View className="p-6 rounded-t-3xl mt-4" style={{ backgroundColor: theme.colors.surface }}>
                <Text className="text-lg font-semibold mb-4" style={{ color: theme.colors.text }}>
                    Select 5-Second Segment
                </Text>

                <View className="flex-row justify-between mb-2">
                    <Text style={{ color: theme.colors.text }}>{formatTime(startTime)}</Text>
                    <Text style={{ color: theme.colors.text }}>{formatTime(endTime)}</Text>
                </View>

                <Slider
                    minimumValue={0}
                    maximumValue={Math.max(0, duration - 5)}
                    value={startTime}
                    onValueChange={handleSliderChange}
                    minimumTrackTintColor={theme.colors.primary}
                    maximumTrackTintColor={theme.colors.muted}
                    thumbTintColor={theme.colors.primary}
                />

                <View className="flex-row justify-between mt-4">
                    <Text style={{ color: theme.colors.muted }}>
                        Current: {formatTime(currentTime)}
                    </Text>
                    <Text style={{ color: theme.colors.muted }}>
                        Duration: {formatTime(endTime - startTime)}s
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => cropMutation.mutate({ startTime, endTime, duration: endTime - startTime })}
                    disabled={cropMutation.isPending}
                    className="py-4 rounded-xl mt-6"
                    style={{ 
                        backgroundColor: theme.colors.primary,
                        opacity: cropMutation.isPending ? 0.7 : 1
                    }}
                >
                    {cropMutation.isPending ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-center font-semibold text-white">
                            Crop Video
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
