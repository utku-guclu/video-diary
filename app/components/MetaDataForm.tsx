import React from 'react';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { Metadata } from '@/types';

interface Props {
  onSubmit: (metadata: Metadata) => void;
  initialValues: Metadata;
}

// Component to display video metadata form
export default function MetadataForm({ onSubmit, initialValues }: Props) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [errors, setErrors] = useState({ title: '', description: '' });

  const handleSubmit = () => {
    console.log('Submit button clicked');
    // Reset errors
    setErrors({ title: '', description: '' });

    // Validate
    if (!title.trim()) {
      console.log('Title validation failed');
      setErrors(prev => ({ ...prev, title: 'Title is required' }));
      return;
    }
    if (!description.trim()) {
      console.log('Description validation failed');
      setErrors(prev => ({ ...prev, description: 'Description is required' }));
      return;
    }

    // Submit if valid
    console.log('Calling onSubmit with:', { title, description });
    onSubmit({ title: title.trim(), description: description.trim() });
  };

  return (
    <View className="p-4 bg-white flex-1">
      <View className="mb-4">
        <Text className="text-gray-700 mb-2 font-medium">Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter video title"
          className="border border-gray-300 rounded-lg p-3"
        />
        {errors.title ? (
          <Text className="text-red-500 mt-1">{errors.title}</Text>
        ) : null}
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2 font-medium">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter video description"
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-lg p-3"
        />
        {errors.description ? (
          <Text className="text-red-500 mt-1">{errors.description}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-black py-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Save Details</Text>
      </TouchableOpacity>
    </View>
  );
}
