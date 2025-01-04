import { CropConfig } from '@/types';
import axios, { AxiosError } from 'axios';

export default class CreatomateService {
    private static readonly API_KEY = process.env.EXPO_PUBLIC_CREATOMATE_API_KEY;
    private static readonly API_URL = process.env.EXPO_PUBLIC_CREATOMATE_API_URL;

    private static async checkRenderStatus(renderId: string): Promise<string> {
        const maxAttempts = 30; // Maximum number of attempts
        const delayMs = 2000;   // 2 seconds between attempts

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const response = await axios.get(
                    `${this.API_URL}/renders/${renderId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${this.API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const status = response.data?.status;
                console.log(`Render status (attempt ${attempt + 1}):`, status);

                if (status === 'succeeded') {
                    return response.data.url;
                } else if (status === 'failed') {
                    throw new Error('Video rendering failed');
                }

                // Wait before next attempt
                await new Promise(resolve => setTimeout(resolve, delayMs));
            } catch (error) {
                console.error('Error checking render status:', error);
                throw error;
            }
        }

        throw new Error('Render timeout: Video processing took too long');
    }

    static async cropVideo(videoPath: string, config: CropConfig): Promise<string> {
        try {
            console.log('Starting video crop with payload:', {
                videoPath,
                startTime: config.startTime,
                duration: config.duration
            });

            const payload = {
                source: {
                    output_format: "mp4",
                    elements: [
                        {
                            type: "video",
                            source: videoPath,
                            trim_start: config.startTime,
                            trim_duration: config.duration
                        }
                    ]
                }
            };

            const response = await axios.post(
                `${this.API_URL}/renders`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${this.API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('API Response:', response.data);

            if (Array.isArray(response.data) && response.data[0]?.id) {
                // Wait for rendering to complete
                return await this.checkRenderStatus(response.data[0].id);
            }

            if (response.data?.id) {
                return await this.checkRenderStatus(response.data.id);
            }

            throw new Error('Video processing response missing render ID');
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errorDetails = {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                };
                console.log('API Error Details:', errorDetails);
                throw new Error(`Video processing failed: ${JSON.stringify(errorDetails)}`);
            }
            
            if (error instanceof Error) {
                console.log('Error Details:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
                throw error;
            }
            
            throw new Error('Video processing encountered an unexpected error');
        }
    }
}