import * as SQLite from 'expo-sqlite';
import { Video } from '../types';

export class DatabaseService {
    private static instance: DatabaseService;
    private db: SQLite.SQLiteDatabase;

    private constructor() {
        this.db = SQLite.openDatabaseSync('videos.db');

        /* CAUTION: This is for resetting the database! */
        // this.db.runAsync('DROP TABLE IF EXISTS videos');

        this.db.runAsync(`
            CREATE TABLE IF NOT EXISTS videos (
                id TEXT PRIMARY KEY,
                uri TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                createdAt INTEGER NOT NULL,
                duration INTEGER NOT NULL,
                thumbnail TEXT NOT NULL,
                cropConfig TEXT
            )
        `);
    }

    static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    async getAllVideos(): Promise<Video[]> {
        const result = await this.db.getAllAsync<any>('SELECT * FROM videos ORDER BY createdAt DESC');
        return result.map(video => ({
            ...video,
            cropConfig: video.cropConfig ? JSON.parse(video.cropConfig) : undefined
        }));
    }

    async addVideo(video: Video): Promise<void> {
        const query = `
            INSERT INTO videos (id, uri, title, description, createdAt, duration, thumbnail, cropConfig) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await this.db.runAsync(query, [
            video.id,
            video.uri,
            video.title,
            video.description,
            video.createdAt,
            video.duration,
            video.thumbnail,
            video.cropConfig ? JSON.stringify(video.cropConfig) : null
        ]);
    }


    async deleteVideo(id: string): Promise<void> {
        await this.db.runAsync('DELETE FROM videos WHERE id = ?', [id]);
    }

    async updateVideo(id: string, updates: Partial<Video>): Promise<void> {
        const validColumns = ['uri', 'title', 'description', 'createdAt', 'duration', 'thumbnail'];
        const filteredUpdates = Object.entries(updates)
            .filter(([key]) => validColumns.includes(key))
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        if (Object.keys(filteredUpdates).length === 0) return;

        const setClause = Object.keys(filteredUpdates)
            .map(key => `${key} = ?`)
            .join(', ');

        const values = [...Object.values(filteredUpdates), id];

        await this.db.runAsync(
            `UPDATE videos SET ${setClause} WHERE id = ?`,
            values as SQLite.SQLiteBindParams
        );

        // Handle cropConfig separately if present
        if ('cropConfig' in updates) {
            await this.db.runAsync(
                `UPDATE videos SET cropConfig = ? WHERE id = ?`,
                [updates.cropConfig ? JSON.stringify(updates.cropConfig) : null, id]
            );
        }

    }

    async deleteAllVideos(): Promise<void> {
        await this.db.runAsync('DELETE FROM videos');
    }
}

export default DatabaseService;