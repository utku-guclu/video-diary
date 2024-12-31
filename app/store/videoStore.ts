import { create } from 'zustand';
import { Video } from '../types';

import { dummyVideos } from '../temp/dummyVideos';

import * as SQLite from 'expo-sqlite';
import { DatabaseService } from 'db/database';

let db: SQLite.SQLiteDatabase;

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

// Creating video store
const videoStore = create<VideoStore>((set) => ({
  videos: [...dummyVideos], // test data
  isFormVisible: false, // set metadata form visibility to false initially
  selectedVideoUri: null, // selected video uri

  // Loading videos
  loadVideos: async () => {
    const dbService = DatabaseService.getInstance();
    const videos = await dbService.getAllVideos();
    set({ videos });
  },

  // Add video to database
  addVideo: async (video) => {
    if (!db) db = await SQLite.openDatabaseAsync('videos.db');
    await db.runAsync(
      `INSERT INTO videos (id, uri, title, description, createdAt, duration, thumbnail) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [video.id, video.uri, video.title, video.description, video.createdAt, video.duration, video.thumbnail]
    );
    // Add video to state
    set(state => ({ videos: [...state.videos, video] }));
  },

  // Delete video from database
  deleteVideo: async (id) => {
    if (!db) db = await SQLite.openDatabaseAsync('videos.db');
    await db.runAsync('DELETE FROM videos WHERE id = ?', [id]);
    set(state => ({ videos: state.videos.filter(v => v.id !== id) }));
  },

  // Update video
  updateVideo: async (id, updates) => {
    if (!db) db = await SQLite.openDatabaseAsync('videos.db');
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');

    await db.runAsync(
      `UPDATE videos SET ${setClause} WHERE id = ?`,
      [...Object.values(updates), id]
    );

    set(state => ({
      videos: state.videos.map(v => v.id === id ? { ...v, ...updates } : v)
    }));
  },

  // Setting form visibility
  setFormVisible: (visible) => set({ isFormVisible: visible }),
  // Setting selected video
  setSelectedVideoUri: (uri) => set({ selectedVideoUri: uri }),
}));

export default videoStore;
