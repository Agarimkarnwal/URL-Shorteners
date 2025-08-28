import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db: any;

export const connectDB = async () => {
  try {
    db = await open({
      filename: './urls.db',
      driver: sqlite3.Database
    });

    // Create tables if they don't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shortCode TEXT UNIQUE NOT NULL,
        originalUrl TEXT NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        clickCount INTEGER DEFAULT 0,
        lastClicked DATETIME,
        isActive BOOLEAN DEFAULT 1
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        urlId INTEGER,
        ipAddress TEXT,
        userAgent TEXT,
        referrer TEXT,
        country TEXT,
        device TEXT,
        clickedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (urlId) REFERENCES urls (id)
      )
    `);

    console.log('✅ Database connected and tables created');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
};
