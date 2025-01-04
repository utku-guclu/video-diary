import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Metadata } from '@/types';
import { metadataSchema } from '@/schemas/metadata.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onSubmit: (metadata: Metadata) => void;
  initialValues: Metadata;
}

export default function MetadataForm({ onSubmit, initialValues }: Props) {
  const theme = useTheme();
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(metadataSchema),
    defaultValues: initialValues,
    mode: 'onChange'
  });

  const onSubmitForm = (data: Metadata) => {
    Keyboard.dismiss();
    onSubmit(data);
  };

  return (
    <View 
      className="p-6 flex-1" 
      style={{ backgroundColor: theme.colors.background }}
    >
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="videocam" size={20} color={theme.colors.primary} />
              <Text 
                className="ml-2 font-medium" 
                style={{ color: theme.colors.text }}
              >
                Title
              </Text>
            </View>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Enter video title"
              placeholderTextColor={theme.colors.muted}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderWidth: 1,
                borderColor: errors.title ? theme.colors.error : theme.colors.muted
              }}
            />
            {errors.title && (
              <Text 
                className="mt-2 ml-2" 
                style={{ color: theme.colors.error }}
              >
                {errors.title.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="document-text" size={20} color={theme.colors.primary} />
              <Text 
                className="ml-2 font-medium" 
                style={{ color: theme.colors.text }}
              >
                Description
              </Text>
            </View>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Enter video description"
              placeholderTextColor={theme.colors.muted}
              multiline
              numberOfLines={4}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderWidth: 1,
                borderColor: errors.description ? theme.colors.error : theme.colors.muted,
                height: 120,
                textAlignVertical: 'top'
              }}
            />
            {errors.description && (
              <Text 
                className="mt-2 ml-2" 
                style={{ color: theme.colors.error }}
              >
                {errors.description.message}
              </Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmitForm)}
        className="py-4 rounded-xl"
        style={{ 
          backgroundColor: isValid ? theme.colors.primary : theme.colors.muted,
          opacity: isValid ? 1 : 0.7
        }}
      >
        <Text className="text-center font-semibold text-white" style={{ color: theme.colors.background }}>
          Save Details
        </Text>
      </TouchableOpacity>
    </View>
  );
}
