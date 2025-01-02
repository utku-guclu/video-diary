import { create } from 'zustand';
import { Video } from '../types';

import { dummyVideos } from '../temp/dummyVideos';

import { DatabaseService } from '@/db/database';

interface VideoStore {
  videos: Video[];
  croppedVideos: Video[];
  isFormVisible: boolean;
  selectedVideoUri: string | null;
  selectedVideo: Video | null;
  isCropModalVisible: boolean;
  setSelectedVideoUri: (uri: string | null) => void;
  setFormVisible: (visible: boolean) => void;
  setSelectedVideo: (video: Video | null) => void;
  setCropModalVisible: (visible: boolean) => void;
  addVideo: (video: Video) => void;
  deleteVideo: (id: string) => void;
  deleteAllVideos: () => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  loadVideos: () => Promise<void>;
  loadCroppedVideos: () => Promise<Video[]>
}

// Creating video store
const videoStore = create<VideoStore>((set) => {
  const dbService = DatabaseService.getInstance();

  return {
    videos: [],
    croppedVideos: [],
    isFormVisible: false,
    selectedVideoUri: null,
    selectedVideo: null,
    isCropModalVisible: false,

    // Loading videos
    loadVideos: async () => {
      try {
        const videos = await dbService.getAllVideos();
        set({ videos });
      } catch (error) {
        console.error('Failed to load videos:', error);
      }
    },

    loadCroppedVideos: async () => {
      try {
        const videos = await dbService.getAllVideos();
        const croppedVideos = videos.filter(video => video.cropConfig);
        set({ croppedVideos });
        return croppedVideos; // Explicitly returning the cropped videos
      } catch (error) {
        console.error('Failed to load cropped videos:', error);
        return []; // Return an empty array in case of error
      }
    },

    // Add video to database
    addVideo: async (video: Video) => {
      try {
        await dbService.addVideo(video);
        set(state => {
          const newVideos = [...state.videos, video];
          const newCroppedVideos = video.cropConfig
            ? [...state.croppedVideos, video]
            : state.croppedVideos;

          return {
            videos: newVideos,
            croppedVideos: newCroppedVideos
          };
        });
      } catch (error) {
        console.error('Failed to add video:', error);
        throw error;
      }
    },

    // Delete video from database
    deleteVideo: async (id) => {
      await dbService.deleteVideo(id);
      set(state => ({ videos: state.videos.filter(video => video.id !== id) }));
    },

    // Update video
    updateVideo: async (id, updates) => {
      await dbService.updateVideo(id, updates);
      set(state => ({
        videos: state.videos.map(video =>
          video.id === id ? { ...video, ...updates } : video
        )
      }));
    },

    // Delete All Videos
    deleteAllVideos: async () => {
      await dbService.deleteAllVideos();
      set({ videos: [], croppedVideos: [] });
    },

    setFormVisible: (visible) => set({ isFormVisible: visible }),
    setSelectedVideoUri: (uri) => set({ selectedVideoUri: uri }),
    setSelectedVideo: (video) => set({ selectedVideo: video }),
    setCropModalVisible: (visible) => set({ isCropModalVisible: visible }),
  }
});

export default videoStore;
