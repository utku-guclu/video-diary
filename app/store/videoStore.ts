import { create } from 'zustand';
import { Video } from '../types';

import { dummyVideos } from '../temp/dummyVideos';

import { DatabaseService } from '@/db/database';

interface VideoStore {
  videos: Video[];
  isFormVisible: boolean;
  setFormVisible: (visible: boolean) => void;
  selectedVideoUri: string | null;
  setSelectedVideoUri: (uri: string | null) => void;
  addVideo: (video: Video) => void;
  deleteVideo: (id: string) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  loadVideos: () => Promise<void>;
}

// Creating video store
const videoStore = create<VideoStore>((set) => {
  const dbService = DatabaseService.getInstance();

  return {
    videos: [],
    isFormVisible: false, // set metadata form visibility to false initially
    selectedVideoUri: null, // selected video uri

    // Loading videos
    loadVideos: async () => {
      try {
        const videos = await dbService.getAllVideos();
        set({ videos });
      } catch (error) {
        console.error('Failed to load videos:', error);
      }
    },

    // Add video to database
    addVideo: async (video) => {
      await dbService.addVideo(video);
      set(state => ({ videos: [...state.videos, video] }));
    },

    // Delete video from database
    deleteVideo: async (id) => {
      await dbService.deleteVideo(id);
      set(state => ({ videos: state.videos.filter(v => v.id !== id) }));
    },

    // Update video
    updateVideo: async (id, updates) => {
      await dbService.updateVideo(id, updates);
      set(state => ({
        videos: state.videos.map(v =>
          v.id === id ? { ...v, ...updates } : v
        )
      }));
    },

    // Setting form visibility
    setFormVisible: (visible) => set({ isFormVisible: visible }),
    // Setting selected video
    setSelectedVideoUri: (uri) => set({ selectedVideoUri: uri }),
  }
});

export default videoStore;
