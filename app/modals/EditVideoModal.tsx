import React from 'react';
import { View, Modal, TouchableOpacity, Text } from 'react-native';
import { Video } from '@/types';

import { useTheme } from '@/providers/ThemeProvider';

import MetadataForm from '@/components/MetaDataForm';
import CustomButton from '@/components/CustomButton';

interface Props {
    visible: boolean;
    video: Video;
    onClose: () => void;
    onSave: (video: Video) => void;
}

export default function EditVideoModal({ visible, video, onClose, onSave }: Props) {
    const theme = useTheme();

    return (
        <Modal visible={visible} animationType="slide">
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>

                <MetadataForm
                    initialValues={video}
                    onSubmit={(metadata) => {
                        onSave({ ...video, ...metadata });
                        onClose();
                    }}
                />
                <CustomButton text="Close" onClose={onClose} />
            </View>
        </Modal>
    );
}
