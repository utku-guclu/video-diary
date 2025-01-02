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

export interface ImagePickerResult {
  canceled: boolean;
  assets?: VideoAsset[];
}

export interface FileInfo {
  exists: boolean;
  size: number;
  uri: string;
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