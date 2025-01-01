import { useCallback } from 'react';
import videoStore from '../store/videoStore';
import { Video, CropConfig } from '../types';

export const useVideoStore = () => {
  const store = videoStore();

  const handleAddVideo = useCallback((video: Video) => {
    store.addVideo(video);
  }, []);

  const handleDeleteVideo = useCallback((id: string) => {
    store.deleteVideo(id);
  }, []);

  const handleUpdateVideo = useCallback((id: string, updates: Partial<Video>) => {
    store.updateVideo(id, updates);
  }, []);

  const handleCropVideo = useCallback((id: string, cropConfig: CropConfig) => {
    store.updateVideo(id, { cropConfig });
  }, []);

  const handleFormVisibility = useCallback((visible: boolean) => {
    store.setFormVisible(visible);
  }, []);

  const handleSelectedVideo = useCallback((uri: string | null) => {
    store.setSelectedVideoUri(uri);
  }, []);

  const handleLoadVideos = useCallback(() => {
    store.loadVideos();
  }, []);

  const handleLoadCroppedVideos = useCallback(() => {
   store.loadCroppedVideos();
  }, []);

  return {
    // State
    videos: store.videos,
    croppedVideos: store.croppedVideos,
    isFormVisible: store.isFormVisible,
    selectedVideoUri: store.selectedVideoUri,
  
    
    // Actions
    addVideo: handleAddVideo,
    deleteVideo: handleDeleteVideo,
    updateVideo: handleUpdateVideo,
    cropVideo: handleCropVideo,
    setFormVisible: handleFormVisibility,
    setSelectedVideoUri: handleSelectedVideo,
    loadVideos: handleLoadVideos,
    loadCroppedVideos: handleLoadCroppedVideos
  };
};

export default useVideoStore;