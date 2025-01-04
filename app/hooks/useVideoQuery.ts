import { useEffect, useState } from 'react';
import videoStore from '@/store/videoStore';

export default function useVideoQuery() {
    const { videos, loadVideos } = videoStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeVideos = async () => {
            try {
                await loadVideos();
            } finally {
                setIsLoading(false);
            }
        };

        initializeVideos();
        
        // Set up auto-refresh interval
        const refreshInterval = setInterval(loadVideos, 5000);
        
        return () => clearInterval(refreshInterval);
    }, []);

    return {
        data: videos,
        isLoading
    };
}
