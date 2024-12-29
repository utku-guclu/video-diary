import { create } from 'zustand';
import { Video } from '../types';

interface VideoStore {
  videos: Video[];
  isFormVisible: boolean;
  setFormVisible: (visible: boolean) => void;
  selectedVideoUri: string | null;
  setSelectedVideoUri: (uri: string | null) => void;
 
  addVideo: (video: Video) => void;
  deleteVideo: (id: string) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
}

const videoStore = create<VideoStore>((set) => ({
  videos: [],
  isFormVisible: false,
  selectedVideoUri: null,

  addVideo: (video) => set((state) => ({ 
    videos: [...state.videos, video] 
  })),
  deleteVideo: (id) => set((state) => ({ 
    videos: state.videos.filter(v => v.id !== id) 
  })),
  updateVideo: (id, updates) => set((state) => ({
    videos: state.videos.map(v => v.id === id ? { ...v, ...updates } : v)
  })),
  setFormVisible: (visible) => set({ 
    isFormVisible: visible 
  }),
  setSelectedVideoUri: (uri) => set({ 
    selectedVideoUri: uri 
  }),
}));

export default videoStore;
