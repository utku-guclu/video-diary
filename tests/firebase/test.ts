import { getStorage, ref, listAll, uploadString, getDownloadURL } from 'firebase/storage';
import { app } from '@/config/firebase';

export const testFirebaseStorage = async () => {
    const storage = getStorage(app);
    const storageRef = ref(storage);
    
    console.log('🔥 Firebase Storage Reference:', storageRef);
    
    try {
        const result = await listAll(storageRef);
        console.log('📂 Storage Contents:', {
            files: result.items.length,
            folders: result.prefixes.length
        });
        return true;
    } catch (error) {
        console.log('🔑 Firebase Connection Error:', error);
        return false;
    }
};

export const testUploadPermissions = async () => {
    const storage = getStorage(app);
    const testRef = ref(storage, 'test.txt');
    
    console.log('🎯 Testing upload permissions...');
    await uploadString(testRef, 'Hello Firebase!');
    const url = await getDownloadURL(testRef);
    console.log('✨ Test upload successful:', url);
};

export default {
    testFirebaseStorage,
    testUploadPermissions
};
