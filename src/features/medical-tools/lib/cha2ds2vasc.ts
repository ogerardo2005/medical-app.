import type { ClinicalInterpretation } from './types';

export type AgeBand = 'under65' | '65to74' | '75plus';

export interface Cha2ds2VascInput {
  chf: boolean;
  hypertension: boolean;
  ageBand: AgeBand;
  diabetes: boolean;
  strokeHistory: boolean;
  vascularDisease: boolean;
  isFemale: boolean;
}

export function computeCha2ds2VascScore(input: Cha2ds2VascInput): number {
  let score = 0;
  if (input.chf) score += 1;
  if (input.hypertension) score += 1;
  if (input.ageBand === '65to74') score += 1;
  else if (input.ageBand === '75plus') score += 2;
  if (input.diabetes) score += 1;
  if (input.strokeHistory) score += 2;
  if (input.vascularDisease) score += 1;
  if (input.isFemale) score += 1;
  return score;
}

/**
 * ESC AF guideline thresholds: a score driven only by the sex point (0 in men, or
 * exactly 1 in women from sex alone) is low risk; 1 point in men from a non-sex
 * factor is a "consider" zone; everything else recommends anticoagulation.
 */
export function interpretCha2ds2Vasc(totalScore: number, isFemale: boolean): ClinicalInterpretation {
  const nonSexScore = totalScore - (isFemale ? 1 : 0);

  if (nonSexScore <= 0) {
    return {
      severity: 'good',
      label: 'Riesgo bajo',
      message: isFemale
        ? 'La puntuación proviene únicamente del sexo femenino; en general no se recomienda anticoagulación.'
        : 'Sin factores de riesgo adicionales; en general no se recomienda anticoagulación.',
    };
  }

  if (nonSexScore === 1 && !isFemale) {
    return {
      severity: 'caution',
      label: 'Riesgo bajo-moderado',
      message:
        'Puede considerarse la anticoagulación oral según las características individuales del paciente.',
    };
  }

  return {
    severity: 'danger',
    label: 'Riesgo alto',
    message: 'Se recomienda anticoagulación oral, salvo contraindicación.',
  };
}
