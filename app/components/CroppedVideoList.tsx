import React from "react";
import { useEffect } from "react";
import { View, Text } from "react-native";
import VideoList from "./VideoList";
import { router } from "expo-router";
import useVideoStore from "@/hooks/useVideoStore";

function CroppedVideosList() {
    const { croppedVideos, loadCroppedVideos } = useVideoStore();
  
    useEffect(() => {
      const loadVideos = async () => {
        await loadCroppedVideos();
      };
      loadVideos();
    }, []);
  
    if (croppedVideos.length === 0) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text>No cropped videos yet</Text>
        </View>
      );
    }
  
    return (
      <VideoList 
        isProfileTab={true}
        videos={croppedVideos}
        onVideoPress={(video) => {
          router.push(`/details/${video.id}`);
        }}
      />
    );
  }
  
  export default CroppedVideosList;