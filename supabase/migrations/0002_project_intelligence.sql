-- Project Intelligence Engine — main report storage.
-- Idempotent: safe to re-run.

create table if not exists project_intelligence_reports (
  id               uuid primary key default gen_random_uuid(),
  project_id       text,
  client_request   text not null,
  language         text,
  analysis_depth   text,
  output_json      jsonb not null,
  confidence_score numeric,
  provider_used    text,
  used_fallback    boolean not null default false,
  fallback_reason  text,
  created_at       timestamptz not null default now()
);

create index if not exists project_intelligence_reports_project_id_idx
  on project_intelligence_reports(project_id);
create index if not exists project_intelligence_reports_created_at_idx
  on project_intelligence_reports(created_at desc);

-- ai_outputs is shared across all AI modules. Created defensively here so the
-- Project Intelligence route works on a fresh Supabase instance even when the
-- SRS module hasn't run yet. Existing deployments are unaffected.
create table if not exists ai_outputs (
  id          uuid primary key default gen_random_uuid(),
  project_id  text,
  type        text not null,
  json        jsonb not null,
  created_at  timestamptz not null default now()
);

create index if not exists ai_outputs_project_id_idx on ai_outputs(project_id);
create index if not exists ai_outputs_type_idx       on ai_outputs(type);
