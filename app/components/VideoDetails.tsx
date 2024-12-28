import { View, Text } from 'react-native';
import { Video } from 'expo-av';
import videoStore from '../store/videoStore';

interface VideoDetailsProps {
  id: string | string[];
}

export default function VideoDetails({ id }: VideoDetailsProps) {
  const video = videoStore((state) => 
    state.videos.find((v) => v.id === id)
  );

  if (!video) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Video not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Video
        source={{ uri: video.uri }}
        useNativeControls
        // resizeMode="contain"
        className="w-full h-64"
      />
      
      <View className="p-4">
        <Text className="text-2xl font-bold">{video.title}</Text>
        <Text className="text-gray-600 mt-2">{video.description}</Text>
        
        <View className="mt-4">
          <Text className="text-sm text-gray-500">
            Created: {new Date(video.createdAt).toLocaleDateString()}
          </Text>
          <Text className="text-sm text-gray-500">
            Duration: {Math.floor(video.duration / 60)}:{video.duration % 60}
          </Text>
        </View>
      </View>
    </View>
  );
}
