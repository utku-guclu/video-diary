import { useLocalSearchParams } from 'expo-router';
import VideoDetails  from '../components/VideoDetails';

export default function Details() {
  const { id } = useLocalSearchParams();
  return <VideoDetails id={id} />;
}
