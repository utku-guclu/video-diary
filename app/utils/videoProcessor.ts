import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import { FileInfo, VideoProcessingOptions } from '@/types';

export const VideoProcessor = {
    async generateThumbnail(videoUri: string): Promise<string> {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
            time: 0,
            quality: 0.7
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
        const thumbnails: string[] = [];
        const { startTime, endTime } = options.crop!;
        const duration = endTime - startTime;
        
        // Generate thumbnails at intervals
        for (let time = startTime; time <= endTime; time += duration / 5) {
            const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(uri, {
                time,
                quality: 1
            });
            thumbnails.push(thumbUri);
        }
        
        // Return the first thumbnail as representative frame
        return thumbnails[0];
    }
};

export default VideoProcessor;
