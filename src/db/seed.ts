import type { SQLiteDatabase } from 'expo-sqlite';

import { seedVademecum } from '@/features/medical-tools/data/seedVademecum';

/**
 * Runs every feature's data seeding. Called once at app init, after
 * migrateDatabase. Each seed function is responsible for being a no-op
 * once its table already has data.
 */
export async function seedDatabase(db: SQLiteDatabase) {
  await seedVademecum(db);
}
