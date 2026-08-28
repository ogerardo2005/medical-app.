import type { ClinicalInterpretation } from './types';

export interface CockcroftGaultInput {
  age: number;
  weightKg: number;
  creatinineMgDl: number;
  isFemale: boolean;
}

/**
 * Cockcroft-Gault estimated creatinine clearance (mL/min):
 * CrCl = [(140 - age) x weight(kg) x (0.85 if female)] / (72 x serum creatinine (mg/dL))
 * Returns null while any input is missing/invalid so the UI can withhold the result
 * instead of showing a number computed from garbage.
 */
export function calculateCreatinineClearance({
  age,
  weightKg,
  creatinineMgDl,
  isFemale,
}: CockcroftGaultInput): number | null {
  if (
    !Number.isFinite(age) ||
    !Number.isFinite(weightKg) ||
    !Number.isFinite(creatinineMgDl) ||
    age <= 0 ||
    weightKg <= 0 ||
    creatinineMgDl <= 0
  ) {
    return null;
  }

  const base = ((140 - age) * weightKg) / (72 * creatinineMgDl);
  return isFemale ? base * 0.85 : base;
}

export function interpretCreatinineClearance(crCl: number): ClinicalInterpretation {
  if (crCl >= 90) {
    return {
      severity: 'good',
      label: 'Función renal normal',
      message: 'TFG ≥ 90 mL/min. Función renal conservada.',
    };
  }
  if (crCl >= 60) {
    return {
      severity: 'caution',
      label: 'Disminución leve (ERC G2)',
      message: '60–89 mL/min. Disminución leve de la función renal.',
    };
  }
  if (crCl >= 30) {
    return {
      severity: 'warning',
      label: 'Disminución moderada (ERC G3)',
      message: '30–59 mL/min. Ajustar dosis de fármacos de eliminación renal.',
    };
  }
  if (crCl >= 15) {
    return {
      severity: 'warning',
      label: 'Disminución grave (ERC G4)',
      message: '15–29 mL/min. Riesgo alto; valorar interconsulta a nefrología.',
    };
  }
  return {
    severity: 'danger',
    label: 'Fallo renal (ERC G5)',
    message: '< 15 mL/min. Insuficiencia renal grave / terminal.',
  };
}
