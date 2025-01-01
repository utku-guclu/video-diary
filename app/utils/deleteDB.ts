import * as FileSystem from 'expo-file-system';

const deleteDatabase = async (dbName: string) => {
    const dbPath = `${FileSystem.documentDirectory}${dbName}`;

    try {
        const fileExists = await FileSystem.getInfoAsync(dbPath);
        if (fileExists.exists) {
            await FileSystem.deleteAsync(dbPath, { idempotent: true });
            console.log(`Database ${dbName} deleted successfully.`);
        } else {
            console.log(`Database ${dbName} does not exist.`);
        }
    } catch (error) {
        const e = error as Error;
        console.error(`Error deleting database: ${e.message}`);
    }
};

export default deleteDatabase;