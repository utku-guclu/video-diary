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
