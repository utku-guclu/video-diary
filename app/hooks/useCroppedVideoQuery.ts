import { useQuery } from '@tanstack/react-query';
import type { Video } from '@/types';
import videoStore from '@/store/videoStore';

export default function useCroppedVideosQuery() {
    return useQuery<Video[]>({
      queryKey: ['croppedVideos'],
      queryFn: async () => {
        const videos = await videoStore.getState().loadCroppedVideos();
        return videos;
      }
    });
  }