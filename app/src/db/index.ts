import { drizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';

const sqlite = new Database('sqlite.db', { create: true });

// Create table if it not exists
const initSql = await Bun.file('./src/db/init.sql').text();
sqlite.query(initSql).run();

const db: BunSQLiteDatabase = drizzle(sqlite,{ schema, logger: true });

export { db };
