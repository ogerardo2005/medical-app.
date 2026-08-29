export interface NoteRow {
  id: string;
  user_id: string;
  title: string;
  content: string;
  template_type: string | null;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface FlashcardRow {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  deck_name: string;
  interval: number;
  ease_factor: number;
  repetitions: number;
  next_review: string;
}

export interface VademecumRow {
  id: string;
  nombre_generico: string;
  categoria: string;
  dosis_adultos: string;
  dosis_pediatrica: string;
  contraindicaciones: string;
  mecanismo_accion: string;
}

export interface UserSettingsRow {
  user_id: string;
  guard_mode: boolean;
}
