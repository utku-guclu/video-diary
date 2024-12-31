import React from 'react';
import { View, Modal } from 'react-native';
import { Video } from '@/types';
import MetadataForm from '@/components/MetaDataForm';

interface Props {
    visible: boolean;
    video: Video;
    onClose: () => void;
    onSave: (video: Video) => void;
}

export default function EditVideoModal({ visible, video, onClose, onSave }: Props) {
    return (
        <Modal visible={visible} animationType="slide">
            <View className="flex-1 bg-white">
                <MetadataForm
                    initialValues={video}
                    onSubmit={(metadata) => {
                        onSave({ ...video, ...metadata });
                        onClose();
                    }}
                />
            </View>
        </Modal>
    );
}
