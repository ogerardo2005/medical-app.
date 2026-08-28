export interface NoteTemplate {
  id: 'soap' | 'clinical-history' | 'evolution';
  label: string;
  defaultTitle: string;
  body: string;
}

export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: 'soap',
    label: 'Nota SOAP',
    defaultTitle: 'Nota SOAP',
    body: [
      'SUBJETIVO:',
      '',
      '',
      'OBJETIVO:',
      '',
      '',
      'ANÁLISIS:',
      '',
      '',
      'PLAN:',
      '',
      '',
    ].join('\n'),
  },
  {
    id: 'clinical-history',
    label: 'Historia Clínica',
    defaultTitle: 'Historia Clínica',
    body: [
      'ANAMNESIS:',
      '',
      '',
      'EXAMEN FÍSICO:',
      '',
      '',
      'DIAGNÓSTICO:',
      '',
      '',
      'MANEJO:',
      '',
      '',
    ].join('\n'),
  },
  {
    id: 'evolution',
    label: 'Nota de Evolución / Ingreso',
    defaultTitle: 'Nota de Evolución / Ingreso',
    body: [
      'FECHA Y HORA:',
      '',
      '',
      'MOTIVO DE EVOLUCIÓN / INGRESO:',
      '',
      '',
      'EVOLUCIÓN CLÍNICA:',
      '',
      '',
      'PLAN:',
      '',
      '',
    ].join('\n'),
  },
];
