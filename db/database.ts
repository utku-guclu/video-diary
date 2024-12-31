import { Video } from '@/types';
import * as SQLite from 'expo-sqlite';

export class DatabaseService {
  private static instance: DatabaseService;
  private db: SQLite.SQLiteDatabase | null = null;

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async initialize() {
    this.db = await SQLite.openDatabaseAsync('videos.db');
    
    // Create videos table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS videos (
        id TEXT PRIMARY KEY NOT NULL,
        uri TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        createdAt INTEGER,
        duration INTEGER,
        thumbnail TEXT
      );
    `);
  }

   async getAllVideos(): Promise<Video[]> {
    if (!this.db) throw new Error('Database not initialized');
    const results = await this.db.getAllAsync<Video>('SELECT * FROM videos ORDER BY createdAt DESC');
    return results;
  }

  getDatabase() {
    return this.db;
  }
}
