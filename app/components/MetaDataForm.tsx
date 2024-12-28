import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

interface Props {
  onSubmit: (metadata: { title: string; description: string }) => void;
  initialValues?: { title: string; description: string };
}

// Component to display video metadata form
export function MetadataForm({ onSubmit, initialValues }: Props) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');

  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-2">Video Details</Text>
      
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter video title"
        className="bg-white p-3 rounded-lg mb-4 border border-gray-200"
      />

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter video description"
        multiline
        numberOfLines={4}
        className="bg-white p-3 rounded-lg mb-4 border border-gray-200"
      />

      <TouchableOpacity 
        onPress={() => onSubmit({ title, description })}
        className="bg-black p-4 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Save Details</Text>
      </TouchableOpacity>
    </View>
  );
}
