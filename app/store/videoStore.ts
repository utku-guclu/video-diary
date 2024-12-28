import { create } from 'zustand';
import { Video } from '../types';

interface VideoStore {
  videos: Video[];
  addVideo: (video: Video) => void;
  deleteVideo: (id: string) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
}

// Create Zustand store
export const useVideoStore = create<VideoStore>((set) => ({
  videos: [],
  addVideo: (video) => set((state) => ({ 
    videos: [...state.videos, video] 
  })),
  deleteVideo: (id) => set((state) => ({ 
    videos: state.videos.filter(v => v.id !== id) 
  })),
  updateVideo: (id, updates) => set((state) => ({
    videos: state.videos.map(v => v.id === id ? { ...v, ...updates } : v)
  }))
}));
