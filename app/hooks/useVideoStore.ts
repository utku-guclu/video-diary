import { useCallback } from 'react';
import videoStore from '../store/videoStore';
import { Video } from '../types';

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

  const handleFormVisibility = useCallback((visible: boolean) => {
    store.setFormVisible(visible);
  }, []);

  const handleSelectedVideo = useCallback((uri: string | null) => {
    store.setSelectedVideoUri(uri);
  }, []);

  return {
    // State
    videos: store.videos,
    isFormVisible: store.isFormVisible,
    selectedVideoUri: store.selectedVideoUri,
    
    // Actions
    addVideo: handleAddVideo,
    deleteVideo: handleDeleteVideo,
    updateVideo: handleUpdateVideo,
    setFormVisible: handleFormVisibility,
    setSelectedVideoUri: handleSelectedVideo,
  };
};

export default useVideoStore;