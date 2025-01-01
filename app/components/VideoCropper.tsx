import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useEventListener } from 'expo';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useMutation } from '@tanstack/react-query';
import { CropConfig, Video, VideoProcessingOptions } from '@/types';
import { VideoProcessor } from '@/utils/videoProcessor';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import useVideoHandlers from '@/hooks/useVideoHandlers';

interface Props {
    uri: string;
    video: Video;
    onNext: () => void;
}

export default function VideoCropper({ uri, video, onNext }: Props) {
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
            // First process the video
            const croppedUri = await VideoProcessor.cropVideo(uri, {
                crop: {
                    startTime: config.startTime,
                    endTime: config.endTime,
                    duration: config.duration
                }
            });
    
            // Then handle the cropped video
            return handleCropComplete(video, {
                ...config,
                outputUri: croppedUri
            });
        },
        onSuccess: (newVideo) => {
            Alert.alert(
                "Success",
                "Video cropped successfully!",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            onNext();
                            router.push('/profile');
                        }
                    }
                ]
            );
        },
        onError: (error) => {
            console.error("Error cropping video:", error);
            Alert.alert(
                "Error",
                "Failed to crop video. Please try again."
            );
        }
    });

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // const handlePlaybackStatusUpdate = ({ currentTime, duration }: any) => {
    //     setCurrentTime(currentTime);
    //     if (duration) setDuration(duration);
    // };

    const handleSliderChange = async (value: number) => {
        setStartTime(value);
        setEndTime(Math.min(value + 5, duration));
        player.currentTime = value;
    };

    const handleCrop = () => {
        console.log("Cropping video...");
        cropMutation.mutate({
            startTime,
            endTime,
            duration: endTime - startTime,
        });
    };

    return (
        <View className="flex-1 bg-black">
            <VideoView
                player={player}
                style={{ width: '100%', height: 256 }}
                contentFit="contain"
                nativeControls={false}
            />

            <View className="p-4 bg-white rounded-t-3xl mt-4">
                <Text className="text-lg font-semibold mb-4">
                    Select 5-Second Segment
                </Text>

                <View className="flex-row justify-between mb-2">
                    <Text>{formatTime(startTime)}</Text>
                    <Text>{formatTime(endTime)}</Text>
                </View>

                <Slider
                    minimumValue={0}
                    maximumValue={Math.max(0, duration - 5)}
                    value={startTime}
                    onValueChange={handleSliderChange}
                    minimumTrackTintColor="#000"
                    maximumTrackTintColor="#ddd"
                    thumbTintColor="#000"
                />

                <View className="flex-row justify-between mt-4">
                    <Text className="text-gray-600">
                        Current: {formatTime(currentTime)}
                    </Text>
                    <Text className="text-gray-600">
                        Duration: {formatTime(endTime - startTime)}s
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handleCrop}
                    disabled={cropMutation.isPending}
                    className="bg-black py-4 rounded-lg mt-6"
                >
                    <Text className="text-white text-center font-semibold">
                        {cropMutation.isPending ? 'Processing...' : 'Crop Video'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
