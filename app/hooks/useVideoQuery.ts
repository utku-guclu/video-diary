import { useQuery } from '@tanstack/react-query';
import type { Video } from '@/types';
import videoStore from '@/store/videoStore';

export default function useVideoQuery() {
  return useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      const videos = await videoStore.getState().loadVideos();
      return videos;
    }
  });
}

