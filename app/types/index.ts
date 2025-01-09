// Video
export interface Video {
  id: string;
  uri: string;
  title: string;
  createdAt: number;
  description: string;
  duration: number;
  thumbnail: string;
  cropConfig?: CropConfig; 
}

export interface VideoAsset {
  uri: string;
  duration?: number;
  width?: number;
  height?: number;
  type?: string;
}

export interface VideoMetadata {
    originalUri: string;
    startTime: number;
    endTime: number;
    duration: number;
    createdAt: number;
}

export interface VideoStore {
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
  loadVideos: () => Promise<Video[]>;
  loadCroppedVideos: () => Promise<Video[]>
}

export interface ImagePickerResult {
  canceled: boolean;
  assets?: VideoAsset[];
}

export interface FileInfo {
  exists: boolean;
  uri: string;
  isDirectory: boolean;
  size?: number;
  modificationTime?: number;
  md5?: string;
}

// Metadata
export interface Metadata {
  title: string;
  description: string;
}

export interface CropConfig {
  startTime: number;
  endTime: number;
  duration: number;
  outputUri?: string;
}

export interface VideoProcessingOptions {
    crop?: CropConfig;
    quality?: number;
    format?: VideoExtension;
}

export interface VideoDetailsProps {
  id: string | string[];
}

export type VideoExtension = 'mp4' | 'mov' | 'avi' | 'mkv' | 'wmv' | 'flv' | 'webm';

// Cache
export interface VideoCacheValue {
  videos: Video[];
  size: number;
}

// Theme
export type Theme = {
  colors: {
    background: string;
    secondaryBackground?: string;
    text: string;
    primary: string;
    secondary?: string;
    accent?: string;
    surface?: string;
    success?: string;
    warning?: string;
    error?: string;
    muted?: string;
  }
}

const types = {};
export default types;