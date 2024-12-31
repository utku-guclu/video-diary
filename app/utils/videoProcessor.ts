import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';
import { FileInfo, VideoProcessingOptions } from '@/types';

export const VideoProcessor = {
    async generateThumbnail(videoUri: string): Promise<string> {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
            time: 0,
        });
        return uri;
    },

    async validateVideo(videoUri: string) {
        const fileInfo = await FileSystem.getInfoAsync(videoUri) as FileInfo;
        const fileExtension = videoUri.split('.').pop()?.toLowerCase()!;
        const validVideoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'];

        return {
            exists: fileInfo.exists,
            size: fileInfo.size,
            isValidType: validVideoExtensions.includes(fileExtension),
            extension: fileExtension
        };
    },

    async cropVideo(uri: string, options: VideoProcessingOptions): Promise<string> {
        // Implementation will use FFmpeg for video processing
        // This is a placeholder for the actual implementation
        return uri;
    }
};


