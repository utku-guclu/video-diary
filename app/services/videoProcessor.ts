import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';

import getFileExtension from '@/utils/getFileExtension';
import { FileInfo, VideoProcessingOptions, VideoExtension, VideoMetadata } from '@/types';
import { thumbnailCache } from '@/utils/cache';

export const VideoProcessor = {
    /**
     * Generates a thumbnail from the first frame of the video
     * @param videoUri - Local or remote URI of the video
     * @returns Promise containing the thumbnail URI
     */
    async generateThumbnail(videoUri: string): Promise<string> {
        console.log('Generating thumbnail for video:', videoUri);
        // Check cache first
        const cachedThumbnail = thumbnailCache.get(videoUri);
        if (cachedThumbnail) {
            return cachedThumbnail as string;
        }

        // Verify file exists and is readable
        const fileInfo = await FileSystem.getInfoAsync(videoUri);
        if (!fileInfo.exists) {
            throw new Error('Video file not found');
        }

        // Generate new thumbnail
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
            time: 0,          // Generate thumbnail from first frame
            quality: 0.7      // 70% quality for optimal size/quality ratio
        });

        // Store in cache
        thumbnailCache.set(videoUri, uri);
        return uri;
    },

    /**
     * Gets metadata for the video
     * @param videoUri 
     * @returns 
     */
    async getVideoMetadata(videoUri: string): Promise<VideoMetadata | null> {
        try {
            // Extract the base filename without extension
            const baseUri = videoUri.split('.').slice(0, -1).join('.');
            const metadataPath = `${baseUri}_metadata.json`;

            // Check if metadata file exists
            const metadataInfo = await FileSystem.getInfoAsync(metadataPath);

            if (!metadataInfo.exists) {
                // Check in the crops directory for metadata
                const cropsDir = `${FileSystem.documentDirectory}crops/`;
                const filename = videoUri.split('/').pop()?.split('.')[0];
                const alternateMetadataPath = `${cropsDir}metadata_${filename}.json`;

                const alternateMetadataInfo = await FileSystem.getInfoAsync(alternateMetadataPath);
                if (!alternateMetadataInfo.exists) {
                    return null;
                }

                const metadataContent = await FileSystem.readAsStringAsync(alternateMetadataPath);
                return JSON.parse(metadataContent);
            }

            const metadataContent = await FileSystem.readAsStringAsync(metadataPath);
            return JSON.parse(metadataContent);
        } catch (error) {
            console.error('Error reading video metadata:', error);
            return null;
        }
    },

    /**
     * Validates video file size and format
     * @param videoUri - URI of the video to validate
     * @returns Object containing validation results
     */
    async validateVideo(videoUri: string) {
        console.log('Validating video:', videoUri);
        const fileInfo = await FileSystem.getInfoAsync(videoUri) as FileInfo;
        console.log('File info:', fileInfo);

        // Check if file extension is supported
        const fileExtension = getFileExtension(videoUri);
        const validVideoExtensions: VideoExtension[] = ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'webm'];

        if (!validVideoExtensions.includes(fileExtension as VideoExtension)) {
            throw new Error(`Invalid video extension: ${fileExtension}`);
        }

        // Check file size (max 100MB)
        const fileSize = fileInfo.size ?? 0;
        const MAX_FILE_SIZE = 100 * 1024 * 1024;
        if (fileSize > MAX_FILE_SIZE) {
            throw new Error('Video file is too large (max 100MB)');
        }

        return {
            exists: fileInfo.exists,
            size: fileSize,
            isValidType: validVideoExtensions.includes(fileExtension as VideoExtension),
            extension: fileExtension
        };
    },

    /**
     * Get MIME type based on file extension
     * @private
     */
    getMimeType(extension: string): string {
        const mimeTypes: Record<string, string> = {
            'mp4': 'video/mp4',
            'mov': 'video/quicktime',
            'avi': 'video/x-msvideo',
            'wmv': 'video/x-ms-wmv',
            'flv': 'video/x-flv',
            'webm': 'video/webm',
            'mkv': 'video/x-matroska'
        };

        return mimeTypes[extension] || 'video/mp4';
    },

    /**
     * Crops video with metadata for displaying in the app
     * Uses a simulated crop by creating metadata about the crop points
     * but doesn't physically trim the video file
     * 
     * @param uri - Video URI to crop
     * @param options - Crop options including start and end times
     * @returns Promise containing the cropped video URI
     */
    async cropVideo(uri: string, options: VideoProcessingOptions): Promise<string> {
        try {
            // Verify crop options exist
            if (!options.crop) {
                throw new Error('Crop options are required');
            }

            // Ensure the crops directory exists
            const cropsDir = `${FileSystem.documentDirectory}crops/`;
            const cropsDirInfo = await FileSystem.getInfoAsync(cropsDir);

            if (!cropsDirInfo.exists) {
                await FileSystem.makeDirectoryAsync(cropsDir, { intermediates: true });
            }

            const outputFilename = `crop_${Date.now()}.mp4`;
            const outputUri = `${cropsDir}${outputFilename}`;

            // First, create a copy of the original file
            await FileSystem.copyAsync({
                from: uri,
                to: outputUri
            });

            // Save the crop metadata for the new file
            const metadata: VideoMetadata = {
                originalUri: uri,
                startTime: options.crop.startTime,
                endTime: options.crop.endTime,
                duration: options.crop.duration,
                createdAt: Date.now()
            };

            const metadataUri = `${cropsDir}metadata_${outputFilename.split('.')[0]}.json`;
            await FileSystem.writeAsStringAsync(
                metadataUri,
                JSON.stringify(metadata)
            );

            console.log('Video crop metadata created successfully:', outputUri);
            console.log('Note: Video file is not physically trimmed. Your player will use the metadata to display only the selected portion.');

            return outputUri;
        } catch (error) {
            console.error('Error cropping video:', error);
            throw new Error(`Failed to crop video: ${(error as Error).message}`);
        }
    }
};