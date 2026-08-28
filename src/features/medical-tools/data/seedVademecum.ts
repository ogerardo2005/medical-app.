import type { SQLiteDatabase } from 'expo-sqlite';

import vademecumSeed from './vademecum_seed.json';

interface VademecumSeedEntry {
  nombre_generico: string;
  categoria: string;
  dosis_adultos: string;
  dosis_pediatrica: string;
  contraindicaciones: string;
  mecanismo_accion: string;
}

const SEED_ENTRIES = vademecumSeed as VademecumSeedEntry[];

/**
 * Populates the `vademecum` table from vademecum_seed.json the first time the
 * app runs on a device. No-ops on every later launch (checks the row count
 * first), so it never duplicates rows or clobbers entries a user might edit.
 */
export async function seedVademecum(db: SQLiteDatabase) {
  const { count } = (await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM vademecum'
  )) ?? { count: 0 };

  if (count > 0) return;

  await db.withTransactionAsync(async () => {
    for (const drug of SEED_ENTRIES) {
      await db.runAsync(
        `INSERT INTO vademecum
          (nombre_generico, categoria, dosis_adultos, dosis_pediatrica, contraindicaciones, mecanismo_accion)
         VALUES (?, ?, ?, ?, ?, ?)`,
        drug.nombre_generico,
        drug.categoria,
        drug.dosis_adultos,
        drug.dosis_pediatrica,
        drug.contraindicaciones,
        drug.mecanismo_accion
      );
    }
  });
}
