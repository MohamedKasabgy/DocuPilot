-- Scope Impact Engine — analysis storage.
-- Idempotent: safe to re-run.

create table if not exists scope_analyses (
  id                       uuid primary key default gen_random_uuid(),
  project_id               text,
  new_request              text not null,
  existing_srs             text,
  contract_scope           text,
  language                 text,
  scope_status             text not null,
  recommendation           text not null,
  timeline_impact          text,
  cost_impact              text,
  business_impact          text,
  risk_impact              text,
  output_json              jsonb not null,
  confidence_score         numeric,
  provider_used            text,
  used_fallback            boolean not null default false,
  fallback_reason          text,
  created_at               timestamptz not null default now()
);

create index if not exists scope_analyses_project_id_idx
  on scope_analyses(project_id);
create index if not exists scope_analyses_created_at_idx
  on scope_analyses(created_at desc);
create index if not exists scope_analyses_scope_status_idx
  on scope_analyses(scope_status);

-- alerts is shared across modules. Created defensively here so this route works
-- on a fresh Supabase instance even if the contracts module hasn't run yet.
create table if not exists alerts (
  id          uuid primary key default gen_random_uuid(),
  project_id  text,
  source      text not null,
  severity    text not null default 'medium',
  title       text not null,
  description text,
  status      text not null default 'active',
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists alerts_project_id_idx on alerts(project_id);
create index if not exists alerts_severity_idx   on alerts(severity);
create index if not exists alerts_status_idx     on alerts(status);
