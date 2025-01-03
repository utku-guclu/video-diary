import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import getFileExtension from '@/utils/getFileExtension';

import { FileInfo, VideoProcessingOptions, VideoExtension } from '@/types';
import { ShotstackService } from './shotStack';

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

        try {
              // Validate input file exists
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                throw new Error('Source video file not found');
            }

            // Create output directory if it doesn't exist
            const outputDir = `${FileSystem.documentDirectory}crops/`;
            const dirInfo = await FileSystem.getInfoAsync(outputDir);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(outputDir, { intermediates: true });
            }

            // Generate output filename
            const fileName = `crop_${Date.now()}.mp4`;
            const outputUri = `${outputDir}${fileName}`;

            // Process video using Shotstack
            const croppedVideoUrl = await ShotstackService.cropVideo(uri, {
                startTime,
                endTime,
                duration: endTime - startTime
            });

            // Download the cropped video to local storage
            const downloadResult = await FileSystem.downloadAsync(croppedVideoUrl, outputUri);
            console.log('Video processing completed:', downloadResult);

            return outputUri;
        } catch (error) {
            console.error('Video crop error:', error);
            throw new Error('Video cropping failed');
        }
    }
};

export default VideoProcessor;