import React from "react";
import { useEffect } from "react";
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