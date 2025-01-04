import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
  Animated,
  PanResponder,
} from 'react-native';

import { VideoView, useVideoPlayer } from 'expo-video';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useOrientation } from '@/hooks/useOrientation';
import { useTheme } from '@/providers/ThemeProvider';
import { VideoDetailsProps } from '@/types';

import videoStore from '@/store/videoStore';
import EditVideoModal from '@/modals/EditVideoModal';
import CropVideoModal from '@/modals/CropVideoModal';

import formatDuration from '@/utils/formatDuration';
import formatDate from '@/utils/formatDate';

import * as ScreenOrientation from 'expo-screen-orientation';
import styles from './styles';

/**
 * VideoDetails Component
 * Displays a video player with detailed information and controls.
 * Supports both portrait and landscape orientations with responsive layout.
 */
export default function VideoDetails({ id }: VideoDetailsProps) {
  // Theme and layout hooks
  const theme = useTheme();
  const orientation = useOrientation();
  const { width, height } = useWindowDimensions();

  // Orientation state
  const isLandscape = orientation === 'LANDSCAPE';

  // Modal visibility states
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showCropModal, setShowCropModal] = React.useState(false);
  const [detailsVisible, setDetailsVisible] = React.useState(!isLandscape);

  // Animation value for details panel sliding
  const translateY = React.useRef(new Animated.Value(0)).current;

  // Store actions and video data
  const { deleteVideo, updateVideo } = videoStore();
  const video = videoStore((state) => state.videos.find((video) => video.id === id));

  // Initialize video player ref
  const playerRef = React.useRef<ReturnType<typeof useVideoPlayer>>(null);

  // Initialize video player
  const player = useVideoPlayer(video?.uri || '', (playerInstance) => {
    playerInstance.timeUpdateEventInterval = 0.5;
    playerRef.current = playerInstance; // Store the player instance in the ref
  });

  // Pan gesture handler for details panel in landscape mode
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isLandscape,
      onMoveShouldSetPanResponder: () => isLandscape,
      onPanResponderMove: (_, gestureState) => {
        if (isLandscape) {
          // Limit vertical movement
          const newY = Math.max(-height * 0.3, Math.min(0, gestureState.dy));
          translateY.setValue(newY);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isLandscape) {
          // Show/hide panel based on gesture distance
          if (Math.abs(gestureState.dy) > 50) {
            const shouldShow = gestureState.dy < 0;
            Animated.spring(translateY, {
              toValue: shouldShow ? -height * 0.3 : 0,
              useNativeDriver: true,
              damping: 20,
              stiffness: 90
            }).start();
            setDetailsVisible(shouldShow);
          } else {
            // Return to previous state if gesture not decisive
            Animated.spring(translateY, {
              toValue: detailsVisible ? -height * 0.3 : 0,
              useNativeDriver: true,
              damping: 20,
              stiffness: 90
            }).start();
          }
        }
      },
    })
  ).current;

  // Reset details panel on orientation change
  useEffect(() => {
    setDetailsVisible(!isLandscape);
    translateY.setValue(0);
  }, [isLandscape]);

  // Handle screen orientation and cleanup
  useEffect(() => {
    ScreenOrientation.unlockAsync();

    return () => {
      // Proper cleanup sequence
      if (playerRef.current) {
        try {
          player.pause();
        } catch (error) {
          console.log('Player cleanup:', error);
        }
      }
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  // Loading state
  if (!video) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Video not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Video Player Container */}
      <View style={[
        styles.videoContainer,
        {
          // Take full screen in landscape, 60% in portrait
          height: isLandscape ? '100%' : height * 0.6,
          // Ensure video container is on top in landscape
          zIndex: isLandscape ? 2 : 1,
        },
        isLandscape && {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }
      ]}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="contain"
          nativeControls
        />
      </View>

      {/* Details Panel - Hidden in landscape unless swiped */}
      {!isLandscape && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.detailsPanel,
            {
              backgroundColor: theme.colors.background,
              transform: [{ translateY }],
              zIndex: 1
            }
          ]}
        >
          {/* Panel Content */}
          <ScrollView>
            <View style={styles.detailsContent}>
              {/* Title and Action Buttons */}
              <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                  {video.title}
                </Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setShowCropModal(true)}
                  >
                    <Feather name="crop" size={24} color={theme.colors.text} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setShowEditModal(true)}
                  >
                    <Feather name="edit" size={24} color={theme.colors.text} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      Alert.alert(
                        "Delete Video",
                        "Are you sure you want to delete this video?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => deleteVideo(video.id)
                          }
                        ]
                      );
                    }}
                  >
                    <Feather name="trash" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.metadataContainer}>
                <View style={styles.metadataItem}>
                  <MaterialIcons name="access-time" size={16} color={theme.colors.text} />
                  <Text style={[styles.metadataText, { color: theme.colors.text }]}>
                    {formatDuration(video.duration)}
                  </Text>
                </View>
                <View style={styles.metadataItem}>
                  <MaterialIcons name="calendar-today" size={16} color={theme.colors.text} />
                  <Text style={[styles.metadataText, { color: theme.colors.text }]}>
                    {formatDate(video.createdAt)}
                  </Text>
                </View>
              </View>

              <Text style={[styles.description, { color: theme.colors.text }]}>
                {video.description}
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      )}

      {/* Modals - Only available in portrait mode */}
      {!isLandscape && (
        <>
          <EditVideoModal
            visible={showEditModal}
            video={video}
            onClose={() => setShowEditModal(false)}
            onSave={(updates) => {
              updateVideo(video.id, updates);
              setShowEditModal(false);
            }}
          />
          <CropVideoModal
            visible={showCropModal}
            video={video}
            onClose={() => setShowCropModal(false)}
          />
        </>
      )}
    </View>
  );
}