export interface NoteRow {
  id: number;
  title: string;
  content: string;
  template_type: string | null;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface FlashcardRow {
  id: number;
  question: string;
  answer: string;
  deck_name: string;
  interval: number;
  ease_factor: number;
  repetitions: number;
  next_review: string;
}

export interface CalculatorRow {
  id: number;
  name: string;
  category: string;
  formula_data: string;
}

export interface VademecumRow {
  id: number;
  nombre_generico: string;
  categoria: string;
  dosis_adultos: string;
  dosis_pediatrica: string;
  contraindicaciones: string;
  mecanismo_accion: string;
}
