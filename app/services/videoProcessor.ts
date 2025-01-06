import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';

import CreatomateService from './creatomate';
import getFileExtension from '@/utils/getFileExtension';

import { FileInfo, VideoProcessingOptions, VideoExtension, VideoMetadata } from '@/types';

import { thumbnailCache } from '@/utils/cache';

import { app } from '@/config/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { testFirebaseStorage, testUploadPermissions } from 'tests/firebase/test';

// Get Firebase Storage instance
const storage = getStorage(app);

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
        const MAX_FILE_SIZE = 100 * 1024 * 1024;
        if (fileInfo.size > MAX_FILE_SIZE) {
            throw new Error('Video file is too large (max 100MB)');
        }

        return {
            exists: fileInfo.exists,
            size: fileInfo.size,
            isValidType: validVideoExtensions.includes(fileExtension as VideoExtension),
            extension: fileExtension
        };
    },

    /**
     * Uploads video to Firebase Storage and returns public URL
     * @param fileUri - Local URI of the video file
     * @returns Promise containing the public download URL
     */
    async getUploadUrl(fileUri: string): Promise<string> {
        testUploadPermissions();
        testFirebaseStorage();
        
        return new Promise((resolve, reject) => {
            const filename = `videos/${Date.now()}.mp4`;
            const storageRef = ref(storage, filename);
            
            // Set smaller chunk size for better upload handling
            const metadata = {
                contentType: 'video/mp4',
                customMetadata: {
                    originalName: fileUri.split('/').pop() || 'video.mp4'
                }
            };
    
            fetch(fileUri)
                .then(response => response.blob())
                .then(blob => {
                    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);
                    
                    // Enhanced progress monitoring
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            const state = snapshot.state;
                            console.log(`📊 Upload progress: ${progress.toFixed(2)}% (${state})`);
                            console.log(`📦 Bytes: ${snapshot.bytesTransferred}/${snapshot.totalBytes}`);
                        },
                        (error) => {
                            console.log('📡 Upload state:', error.serverResponse);
                            console.log('🔍 Error code:', error.code);
                            reject(error);
                        },
                        async () => {
                            const downloadUrl = await getDownloadURL(storageRef);
                            console.log('🎯 Success! URL:', downloadUrl);
                            resolve(downloadUrl);
                        }
                    );
                });
        });
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
            } catch {}
            
            console.error('Video crop error:', error);
            throw error;
        }
    }
}

export default VideoProcessor;
