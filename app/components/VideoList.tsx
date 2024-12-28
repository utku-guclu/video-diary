import { FlashList } from '@shopify/flash-list';
import { VideoItem } from './VideoItem';
import { Video } from '../types';

interface Props {
  videos: Video[];
  onVideoPress: (video: Video) => void;
}

// Component to display a list of videos
export function VideoList({ videos, onVideoPress }: Props) {
  return (
    <FlashList
      data={videos}
      renderItem={({ item }) => (
        <VideoItem video={item} onPress={() => onVideoPress(item)} />
      )}
      estimatedItemSize={100}
    />
  );
}
