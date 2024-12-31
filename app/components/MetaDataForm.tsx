import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Metadata } from '@/types';
import { metadataSchema } from '@/schemas/metadata.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

interface Props {
  onSubmit: (metadata: Metadata) => void;
  initialValues: Metadata;
}

export default function MetadataForm({ onSubmit, initialValues }: Props) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(metadataSchema),
    defaultValues: initialValues
  });

  const onSubmitForm = (data: Metadata) => {
    onSubmit(data);
  };

  return (
    <View className="p-4 bg-white flex-1">
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Title</Text>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Enter video title"
              className="border border-gray-300 rounded-lg p-3"
            />
            {errors.title && (
              <Text className="text-red-500 mt-1">{errors.title.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Description</Text>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Enter video description"
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-lg p-3"
            />
            {errors.description && (
              <Text className="text-red-500 mt-1">{errors.description.message}</Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmitForm)}
        className="bg-black py-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Save Details</Text>
      </TouchableOpacity>
    </View>
  );
}
