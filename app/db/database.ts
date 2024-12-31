import * as SQLite from 'expo-sqlite';
import { Video } from '../types';

export class DatabaseService {
    private static instance: DatabaseService;
    private db: SQLite.SQLiteDatabase;

    private constructor() {
        this.db = SQLite.openDatabaseSync('videos.db');
        this.db.runAsync(`
            CREATE TABLE IF NOT EXISTS videos (
                id TEXT PRIMARY KEY,
                uri TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                createdAt INTEGER NOT NULL,
                duration INTEGER NOT NULL,
                thumbnail TEXT NOT NULL
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
        const result = await this.db.getAllAsync<Video>('SELECT * FROM videos ORDER BY createdAt DESC');
        return result;
    }

    async addVideo(video: Video): Promise<void> {
        const query = `
            INSERT INTO videos (id, uri, title, description, createdAt, duration, thumbnail) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await this.db.runAsync(query, [
            video.id,
            video.uri,
            video.title,
            video.description,
            video.createdAt,
            video.duration,
            video.thumbnail
        ]);
    }

    async deleteVideo(id: string): Promise<void> {
        await this.db.runAsync('DELETE FROM videos WHERE id = ?', [id]);
    }

    async updateVideo(id: string, updates: Partial<Video>): Promise<void> {
        const setClause = Object.keys(updates)
            .map(key => `${key} = ?`)
            .join(', ');

        await this.db.runAsync(
            `UPDATE videos SET ${setClause} WHERE id = ?`,
            [...Object.values(updates), id]
        );
    }
}

export default DatabaseService;