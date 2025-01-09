import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';

import CreatomateService from './creatomate';
import getFileExtension from '@/utils/getFileExtension';

import { FileInfo, VideoProcessingOptions, VideoExtension, VideoMetadata } from '@/types';

import { thumbnailCache } from '@/utils/cache';

import IMGUR_CONFIG from '@/config/imgur';

interface UploadResponse {
    FileId: string;
    FileName: string;
    FileExt: string;
}

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
 * Validates and formats the API configuration
 * @private
 */
    // validateApiConfig(): { baseUrl: string, secretKey: string } {
    //     if (!CONVERT_API_CONFIG?.BASE_URL) {
    //         throw new Error('Convert API base URL is not configured');
    //     }
    //     if (!CONVERT_API_CONFIG?.SECRET_KEY) {
    //         throw new Error('Convert API secret key is not configured');
    //     }

    //     const baseUrl = CONVERT_API_CONFIG.BASE_URL.trim();
    //     const secretKey = CONVERT_API_CONFIG.SECRET_KEY.trim();

    //     // Ensure URL has proper scheme
    //     if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    //         throw new Error('Convert API base URL must start with http:// or https://');
    //     }

    //     // Remove trailing slash if present
    //     return {
    //         baseUrl: baseUrl.replace(/\/$/, ''),
    //         secretKey
    //     };
    // },

    /**
     * Uploads video via Convert API and returns public URL
     * @param fileUri - Local URI of the video file
     * @returns Promise containing the public download URL
     */

    async getUploadUrl(fileUri: string): Promise<string> {
        try {
            // Get file info
            const fileInfo = await FileSystem.getInfoAsync(fileUri, { size: true });

            // Create form data
            const formData = new FormData();
            formData.append('video', {
                uri: fileUri,
                type: this.getMimeType(getFileExtension(fileUri)),
                name: fileUri.split('/').pop()
            } as any);

            // Upload to Imgur
            const response = await fetch(`${IMGUR_CONFIG.apiUrl}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Client-ID ${IMGUR_CONFIG.clientId}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data.link;

        } catch (err) {
            const error = err as Error;
            console.error('❌ Upload error:', error);
            throw new Error(`Video upload failed: ${error.message}`);
        }
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
     * Crops video using Shotstack service
     * @param uri - Video URI to crop
     * @param options - Crop options including start and end times
     * @returns Promise containing the cropped video URI
     */
    async cropVideo(uri: string, options: VideoProcessingOptions): Promise<string> {
        const cropsDir = `${FileSystem.documentDirectory}crops/`;
        const tempDir = `${FileSystem.documentDirectory}temp/`;
        const outputUri = `${cropsDir}crop_${Date.now()}.mp4`;

        try {
            console.log('📁 Creating directories...');
            await FileSystem.makeDirectoryAsync(cropsDir, { intermediates: true });
            await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });

            const tempFile = `${tempDir}source_${Date.now()}.mp4`;
            const { startTime, endTime } = options.crop!;

            console.log('🔄 Processing source video...');
            let sourceVideoUrl;
            if (uri.startsWith('file://')) {
                console.log('📤 Uploading local file...');
                sourceVideoUrl = await this.getUploadUrl(uri);
            } else {
                console.log('⬇️ Downloading remote file...');
                const downloadResult = await FileSystem.downloadAsync(uri, tempFile);
                sourceVideoUrl = await this.getUploadUrl(downloadResult.uri);
            }
            console.log('✅ Source video ready:', sourceVideoUrl);

            console.log('✂️ Starting Creatomate service...');
            const croppedVideoUrl = await CreatomateService.cropVideo(sourceVideoUrl, {
                startTime,
                endTime,
                duration: endTime - startTime
            });
            console.log('✅ Creatomate processing complete:', croppedVideoUrl);

            console.log('⬇️ Downloading final video...');
            // Download with verification
            const finalVideo = await FileSystem.downloadAsync(croppedVideoUrl, outputUri);

            console.log('🔍 Verifying downloaded file...');
            // Verify downloaded file
            const downloadedFileInfo = await FileSystem.getInfoAsync(finalVideo.uri);
            if (!downloadedFileInfo.exists || downloadedFileInfo.size < 1000) {
                throw new Error('Downloaded video file is invalid or incomplete');
            }

            console.log('🎥 Testing video playability...');
            // Verify video is readable
            try {
                const testThumbnail = await VideoThumbnails.getThumbnailAsync(finalVideo.uri, {
                    time: 0,
                    quality: 0.1
                });
                await FileSystem.deleteAsync(testThumbnail.uri, { idempotent: true });
            } catch (e) {
                throw new Error('Downloaded video file is corrupt or unreadable');
            }

            console.log('📝 Saving metadata...');
            const metadata = {
                originalUri: uri,
                startTime,
                endTime,
                duration: endTime - startTime,
                createdAt: Date.now()
            };

            const filename = outputUri.split('/').pop()?.split('.')[0];
            const metadataPath = `${cropsDir}metadata_${filename}.json`;
            await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify(metadata));

            console.log('🧹 Cleaning up temporary files...');
            await FileSystem.deleteAsync(tempDir, { idempotent: true });

            // console.log('uri', finalVideo.uri);
            // console.log('metadata', metadata);

            console.log('✨ Video crop complete!', { outputUri: finalVideo.uri });
            return finalVideo.uri;

        } catch (error) {
            // Clean up partial downloads
            console.error('❌ Video crop error:', error);
            try {
                await FileSystem.deleteAsync(outputUri, { idempotent: true });
            } catch { }

            console.error('Video crop error:', error);
            throw error;
        }
    }
}

export default VideoProcessor;
