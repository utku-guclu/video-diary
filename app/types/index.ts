export interface Video {
  id: string;
  uri: string;
  name: string;
  description: string;
  timestamp: number;
  duration: number;
}

export interface CropConfig {
  startTime: number;
  endTime: number;
}

export type VideoExtension = 'mp4' | 'mov' | 'avi' | 'mkv' | 'wmv' | 'flv' | 'webm';