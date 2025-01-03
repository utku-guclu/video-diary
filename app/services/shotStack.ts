import { Platform } from 'react-native';
import FormData from 'form-data';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

interface RenderResponse {
    success: boolean;
    message: string;
    response: {
        id: string;
        status: 'queued' | 'rendering' | 'done' | 'failed';
        url?: string;
        error?: string;
    };
}

interface UploadResponse {
    success: boolean;
    message: string;
    response: {
        id: string;
        url: string;
    };
}

export interface CropConfig {
    startTime: number;
    endTime: number;
    duration?: number;
}

export class ShotstackService {
    private static readonly API_KEY = "xXWuWi9JPx71l1l3uHDJPCyYcWi6GCNvAtzCI681";
    private static readonly EDIT_API_URL = 'https://api.shotstack.io/edit/stage';
    private static readonly INGEST_API_URL = 'https://api.shotstack.io/ingest/stage';
    private static readonly POLLING_INTERVAL = 5000;
    private static readonly MAX_POLLING_ATTEMPTS = 60;

    static async cropVideo(videoPath: string, config: CropConfig): Promise<string> {
        try {
            // Check if we're dealing with a local file
            const isLocalFile = videoPath.startsWith('file://') || videoPath.startsWith('/');
            
            let publicVideoUrl: string;
            
            if (isLocalFile) {
                console.log('Local file detected, uploading to Shotstack...');
                publicVideoUrl = await this.uploadVideo(videoPath);
            } else {
                publicVideoUrl = videoPath;
            }

            // Validate timing parameters
            const startTime = config.startTime || 0;
            const endTime = config.endTime || config.duration || 0;
            const duration = endTime - startTime;

            if (startTime < 0) {
                throw new Error('Start time cannot be negative');
            }

            if (duration <= 0) {
                throw new Error('Invalid duration: must be greater than 0');
            }

            console.log('Processing crop with config:', {
                videoUrl: publicVideoUrl.substring(0, 50) + '...',
                startTime,
                endTime,
                duration
            });

            const payload = {
                timeline: {
                    tracks: [{
                        clips: [{
                            asset: {
                                type: "video",
                                src: publicVideoUrl,
                                trim: startTime
                            },
                            start: 0,
                            length: duration
                        }]
                    }]
                },
                output: {
                    format: "mp4",
                    size: {
                        width: 1280,
                        height: 720
                    },
                    fps: 30
                }
            };

            const response = await axios.post<RenderResponse>(
                `${this.EDIT_API_URL}/render`,
                payload,
                {
                    headers: {
                        'x-api-key': this.API_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.data.success) {
                console.error('Shotstack API error:', response.data);
                throw new Error(`Render request failed: ${response.data.message}`);
            }

            return await this.pollRenderStatus(response.data.response.id);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Shotstack API error details:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers
                });

                const errorMessage = error.response?.data?.message 
                    || error.response?.statusText 
                    || error.message;
                throw new Error(`Video cropping failed: ${errorMessage}`);
            }
            console.error('Non-Axios error:', error);
            throw error;
        }
    }

    private static async uploadVideo(videoPath: string): Promise<string> {
        try {
            const formData = new FormData();
            
            // Handle file path for both iOS and Android
            const fileUri = Platform.OS === 'ios' ? videoPath.replace('file://', '') : videoPath;
            
            // Verify file exists and get file info
            const fileInfo = await FileSystem.getInfoAsync(videoPath);
            if (!fileInfo.exists) {
                throw new Error('Video file not found');
            }
    
            // Create blob from file
            const fileContent = await FileSystem.readAsStringAsync(videoPath, {
                encoding: FileSystem.EncodingType.Base64
            });
    
            // Create form data with the file blob
            formData.append('file', {
                uri: fileUri,
                type: 'video/mp4',
                name: 'video.mp4',
                data: fileContent
            });
    
            const response = await axios.post<UploadResponse>(
                `${this.INGEST_API_URL}/sources`,
                formData,
                {
                    headers: {
                        'x-api-key': this.API_KEY,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
    
            return response.data.response.url;
        } catch (error) {
            console.error('Upload error details:', error);
            throw error;
        }
    }    

    private static async pollRenderStatus(renderId: string): Promise<string> {
        let attempts = 0;

        while (attempts < this.MAX_POLLING_ATTEMPTS) {
            try {
                console.log(`Polling render status (attempt ${attempts + 1}/${this.MAX_POLLING_ATTEMPTS})`);
                
                const response = await axios.get<RenderResponse>(
                    `${this.EDIT_API_URL}/render/${renderId}`,
                    {
                        headers: {
                            'x-api-key': this.API_KEY
                        }
                    }
                );

                const { status, url, error } = response.data.response;
                console.log(`Render status: ${status}`);

                switch (status) {
                    case 'done':
                        if (!url) {
                            throw new Error('Render completed but URL is missing');
                        }
                        return url;
                    case 'failed':
                        throw new Error(`Render failed: ${error || 'Unknown error'}`);
                    case 'queued':
                    case 'rendering':
                        await new Promise(resolve => setTimeout(resolve, this.POLLING_INTERVAL));
                        attempts++;
                        break;
                    default:
                        throw new Error(`Unknown render status: ${status}`);
                }
            } catch (error) {
                console.error('Polling error:', error);
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.message || error.message;
                    throw new Error(`Failed to get render status: ${errorMessage}`);
                }
                throw error;
            }
        }

        throw new Error('Render timed out after maximum polling attempts');
    }
}

export default ShotstackService;