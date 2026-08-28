import type { ClinicalInterpretation } from './types';

export interface GlasgowOption {
  points: number;
  label: string;
}

export const EYE_OPENING_OPTIONS: GlasgowOption[] = [
  { points: 4, label: 'Espontánea' },
  { points: 3, label: 'Al estímulo verbal' },
  { points: 2, label: 'Al dolor' },
  { points: 1, label: 'Ninguna' },
];

export const VERBAL_RESPONSE_OPTIONS: GlasgowOption[] = [
  { points: 5, label: 'Orientada' },
  { points: 4, label: 'Confusa' },
  { points: 3, label: 'Palabras inapropiadas' },
  { points: 2, label: 'Sonidos incomprensibles' },
  { points: 1, label: 'Ninguna' },
];

export const MOTOR_RESPONSE_OPTIONS: GlasgowOption[] = [
  { points: 6, label: 'Obedece órdenes' },
  { points: 5, label: 'Localiza el dolor' },
  { points: 4, label: 'Retirada al dolor' },
  { points: 3, label: 'Flexión anormal (decorticación)' },
  { points: 2, label: 'Extensión anormal (descerebración)' },
  { points: 1, label: 'Ninguna' },
];

export function interpretGlasgow(total: number): ClinicalInterpretation {
  if (total >= 13) {
    return {
      severity: 'good',
      label: 'TCE leve',
      message: 'Lesión leve. Vigilancia neurológica de rutina.',
    };
  }
  if (total >= 9) {
    return {
      severity: 'warning',
      label: 'TCE moderado',
      message: 'Lesión moderada. Requiere observación estrecha y reevaluación frecuente.',
    };
  }
  return {
    severity: 'danger',
    label: 'TCE grave (coma)',
    message: 'Lesión grave. Considerar protección de la vía aérea y manejo urgente.',
  };
}
