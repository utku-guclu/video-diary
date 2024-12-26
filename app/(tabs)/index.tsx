import { View, Text, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';

export default function Home() {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with gradient background */}
      <View className="p-6 bg-white shadow-sm">
        <Text className="text-3xl font-bold text-primary">
          Video Diary
        </Text>
      </View>

      {/* Enhanced empty state */}
      <FlashList
        data={[]}
        renderItem={() => null}
        estimatedItemSize={100}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-2xl font-semibold text-gray-800 mb-2">
              Your Video Collection
            </Text>
            <Text className="text-gray-500 text-center text-lg">
              No videos yet. Start by adding one!
            </Text>
          </View>
        }
      />

      {/* Styled floating action button */}
      <TouchableOpacity 
        className="absolute bottom-8 right-8 bg-primary p-5 rounded-full shadow-xl"
        onPress={() => console.log('Add video')}
      >
        <Text className="text-white text-lg font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
}
