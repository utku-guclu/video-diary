// Video
export interface Video {
  id: string;
  uri: string;
  title: string;
  createdAt: number;
  description: string;
  duration: number;
  thumbnail: string;
}

// Metadata
export interface Metadata {
  title: string;
  description: string;
}

export interface CropConfig {
  startTime: number;
  endTime: number;
}

export type VideoExtension = 'mp4' | 'mov' | 'avi' | 'mkv' | 'wmv' | 'flv' | 'webm';

const types = {};
export default types;