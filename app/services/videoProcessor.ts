import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import getFileExtension from '@/utils/getFileExtension';

import { FileInfo, VideoProcessingOptions, VideoExtension } from '@/types';

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
        const fileExtension = getFileExtension(videoUri);
        const validVideoExtensions: VideoExtension[] = ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'webm'];

        if (!validVideoExtensions.includes(fileExtension as VideoExtension)) {
            throw new Error(`Invalid video extension: ${fileExtension}`);
        }

        return {
            exists: fileInfo.exists,
            size: fileInfo.size,
            isValidType: validVideoExtensions.includes(fileExtension),
            extension: fileExtension
        };
    },
 
    async cropVideo(uri: string, options: VideoProcessingOptions): Promise<string> {
        // start and end time for 5 second video
        const { startTime, endTime } = options.crop!;
       
        // Crop Video from uri using start and end time
    
        // Create new uri for cropped video and return the uri
       
        return "";
    }
};

export default VideoProcessor;