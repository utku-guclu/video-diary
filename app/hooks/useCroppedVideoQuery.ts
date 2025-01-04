import { useEffect, useState } from 'react';
import videoStore from '@/store/videoStore';

export default function useCroppedVideoQuery() {
    const { croppedVideos, loadCroppedVideos } = videoStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeVideos = async () => {
            try {
                await loadCroppedVideos();
            } finally {
                setIsLoading(false);
            }
        };

        initializeVideos();
        
        // Set up auto-refresh interval
        const refreshInterval = setInterval(loadCroppedVideos, 5000);
        
        return () => clearInterval(refreshInterval);
    }, []);

    return {
        data: croppedVideos,
        isLoading
    };
}