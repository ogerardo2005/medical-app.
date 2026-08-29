-- Medical App: Supabase schema
-- Run this once in your Supabase project's SQL Editor (Dashboard -> SQL Editor -> New query).
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / ON CONFLICT.

create extension if not exists "pgcrypto";

-- ============================================================
-- notes
-- ============================================================
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  content text not null default '',
  template_type text,
  tags text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_notes_user_id on notes(user_id);
create index if not exists idx_notes_updated_at on notes(updated_at);
create index if not exists idx_notes_template_type on notes(template_type);

alter table notes enable row level security;

drop policy if exists "Users manage their own notes" on notes;
create policy "Users manage their own notes" on notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- flashcards
-- ============================================================
create table if not exists flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  answer text not null,
  deck_name text not null default 'General',
  interval integer not null default 0,
  ease_factor real not null default 2.5,
  repetitions integer not null default 0,
  next_review timestamptz not null default now()
);

create index if not exists idx_flashcards_user_id on flashcards(user_id);
create index if not exists idx_flashcards_deck_name on flashcards(deck_name);
create index if not exists idx_flashcards_next_review on flashcards(next_review);

alter table flashcards enable row level security;

drop policy if exists "Users manage their own flashcards" on flashcards;
create policy "Users manage their own flashcards" on flashcards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- vademecum - shared reference data, NOT scoped per-user.
-- Every signed-in user reads the same table; nobody writes to it from the app.
-- ============================================================
create table if not exists vademecum (
  id uuid primary key default gen_random_uuid(),
  nombre_generico text not null,
  categoria text not null,
  dosis_adultos text not null,
  dosis_pediatrica text not null,
  contraindicaciones text not null,
  mecanismo_accion text not null
);

create index if not exists idx_vademecum_categoria on vademecum(categoria);

alter table vademecum enable row level security;

drop policy if exists "Authenticated users can read vademecum" on vademecum;
create policy "Authenticated users can read vademecum" on vademecum
  for select using (auth.role() = 'authenticated');

-- ============================================================
-- user_settings - app preferences that should also follow you across
-- devices now (e.g. Modo Guardia).
-- ============================================================
create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  guard_mode boolean not null default false
);

alter table user_settings enable row level security;

drop policy if exists "Users manage their own settings" on user_settings;
create policy "Users manage their own settings" on user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Seed the vademecum reference data (idempotent - matches on
-- nombre_generico so re-running this file doesn't duplicate rows).
-- ============================================================
insert into vademecum (nombre_generico, categoria, dosis_adultos, dosis_pediatrica, contraindicaciones, mecanismo_accion)
select v.nombre_generico, v.categoria, v.dosis_adultos, v.dosis_pediatrica, v.contraindicaciones, v.mecanismo_accion
from (values
  ('Paracetamol', 'Analgésico / Antipirético',
   '500-1000 mg VO cada 6-8 h. Dosis máxima 4 g/día (3 g/día en uso crónico o hepatopatía).',
   '10-15 mg/kg/dosis VO cada 4-6 h. Dosis máxima 75 mg/kg/día.',
   'Insuficiencia hepática grave, hipersensibilidad conocida al paracetamol.',
   'Inhibe la síntesis de prostaglandinas predominantemente a nivel central; efecto analgésico y antipirético con escasa actividad antiinflamatoria periférica.'),
  ('Ibuprofeno', 'AINE',
   '400-600 mg VO cada 6-8 h. Dosis máxima 2400 mg/día.',
   '5-10 mg/kg/dosis VO cada 6-8 h. Dosis máxima 40 mg/kg/día.',
   'Úlcera péptica activa, insuficiencia renal grave, tercer trimestre del embarazo, hipersensibilidad a AINE.',
   'Inhibición no selectiva de la ciclooxigenasa (COX-1 y COX-2), reduciendo la síntesis de prostaglandinas proinflamatorias.'),
  ('Omeprazol', 'Inhibidor de la bomba de protones',
   '20-40 mg VO/IV cada 24 h.',
   '0.7-3.3 mg/kg/día VO en 1 dosis, bajo indicación especializada.',
   'Hipersensibilidad a inhibidores de la bomba de protones. Precaución en uso prolongado por riesgo de déficit de B12 y fracturas.',
   'Inhibe de forma irreversible la H+/K+-ATPasa de la célula parietal gástrica, bloqueando la secreción ácida.'),
  ('Amoxicilina', 'Antibiótico (betalactámico)',
   '500-875 mg VO cada 8-12 h.',
   '25-50 mg/kg/día VO dividido cada 8-12 h (hasta 90 mg/kg/día en indicaciones específicas).',
   'Alergia a penicilinas o betalactámicos, mononucleosis infecciosa (riesgo de exantema).',
   'Inhibe la síntesis de la pared celular bacteriana al unirse a las PBP, con actividad bactericida tiempo-dependiente.'),
  ('Metformina', 'Antidiabético oral (biguanida)',
   '500-850 mg VO cada 12-24 h con las comidas, titulando hasta máx. 2550 mg/día.',
   'No indicada de rutina en <10 años; en ≥10 años, 500 mg VO cada 12-24 h según indicación endocrinológica.',
   'Insuficiencia renal grave (TFG <30 mL/min), acidosis metabólica, insuficiencia hepática grave, previo a estudios con contraste yodado.',
   'Reduce la gluconeogénesis hepática y aumenta la sensibilidad periférica a la insulina; no estimula la secreción pancreática de insulina.'),
  ('Losartán', 'Antihipertensivo (ARA-II)',
   '50 mg VO cada 24 h, puede aumentarse a 100 mg/día.',
   '0.7 mg/kg VO cada 24 h (máx. 50 mg/día) en ≥6 años, según indicación.',
   'Embarazo, estenosis bilateral de la arteria renal, hipersensibilidad al fármaco.',
   'Bloquea selectivamente el receptor AT1 de angiotensina II, produciendo vasodilatación y reducción de la presión arterial.'),
  ('Atorvastatina', 'Hipolipemiante (estatina)',
   '10-80 mg VO cada 24 h, habitualmente por la noche.',
   '10 mg VO cada 24 h en ≥10 años con hipercolesterolemia familiar, bajo indicación especializada.',
   'Enfermedad hepática activa, embarazo y lactancia, hipersensibilidad al fármaco.',
   'Inhibe competitivamente la HMG-CoA reductasa, reduciendo la síntesis hepática de colesterol y aumentando los receptores de LDL.'),
  ('Salbutamol', 'Broncodilatador (β2-agonista)',
   '100-200 mcg (1-2 inhalaciones) cada 4-6 h según necesidad.',
   '100 mcg (1 inhalación) cada 4-6 h según necesidad; nebulizado 0.15 mg/kg/dosis (mín. 2.5 mg).',
   'Hipersensibilidad a agonistas β2, taquiarritmias no controladas.',
   'Estimula los receptores β2-adrenérgicos del músculo liso bronquial, produciendo broncodilatación rápida.'),
  ('Metronidazol', 'Antibiótico / Antiparasitario',
   '500 mg VO/IV cada 8 h.',
   '7.5 mg/kg/dosis VO/IV cada 8 h.',
   'Primer trimestre del embarazo, hipersensibilidad a nitroimidazoles, consumo concomitante de alcohol (efecto disulfiram).',
   'Se reduce en el interior de microorganismos anaerobios generando metabolitos que dañan el ADN bacteriano/parasitario.'),
  ('Enalapril', 'Antihipertensivo (IECA)',
   '5-20 mg VO cada 12-24 h.',
   '0.08 mg/kg VO cada 24 h (máx. 5 mg/día inicial), según indicación.',
   'Embarazo, antecedente de angioedema por IECA, estenosis bilateral de arteria renal.',
   'Inhibe la enzima convertidora de angiotensina, disminuyendo la formación de angiotensina II y la degradación de bradicinina.'),
  ('Diazepam', 'Ansiolítico / Anticonvulsivante (benzodiacepina)',
   '2-10 mg VO/IV cada 6-12 h según indicación (ansiólisis, sedación, crisis convulsiva).',
   '0.1-0.3 mg/kg/dosis IV en crisis convulsiva (máx. 10 mg/dosis).',
   'Insuficiencia respiratoria grave, miastenia gravis, apnea del sueño, hipersensibilidad a benzodiacepinas.',
   'Potencia la acción del GABA sobre el receptor GABA-A, aumentando la apertura del canal de cloro y produciendo depresión del SNC.'),
  ('Ondansetrón', 'Antiemético',
   '4-8 mg VO/IV cada 8 h según necesidad.',
   '0.1-0.15 mg/kg/dosis IV cada 8 h (máx. 4 mg/dosis).',
   'Síndrome de QT largo congénito, hipersensibilidad a antagonistas 5-HT3, uso concomitante con apomorfina.',
   'Antagonista selectivo de los receptores 5-HT3 a nivel central (zona gatillo quimiorreceptora) y periférico (nervio vago).')
) as v(nombre_generico, categoria, dosis_adultos, dosis_pediatrica, contraindicaciones, mecanismo_accion)
where not exists (
  select 1 from vademecum existing where existing.nombre_generico = v.nombre_generico
);
