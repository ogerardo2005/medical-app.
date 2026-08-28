export type ResultSeverity = 'good' | 'caution' | 'warning' | 'danger';

export interface ClinicalInterpretation {
  severity: ResultSeverity;
  label: string;
  message: string;
}
