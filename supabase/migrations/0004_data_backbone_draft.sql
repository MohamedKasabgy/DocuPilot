-- 0004_data_backbone_draft.sql
-- Future-state schema for the unified data backbone (Person 1 — Data Backbone + APIs).
-- Safe to apply alongside existing tables (all CREATE statements are IF NOT EXISTS).
-- Mirrors src/lib/data/types.ts.

create table if not exists projects (
  id text primary key,
  name text not null,
  client_name text not null,
  description text not null default '',
  status text not null default 'active'
    check (status in ('discovery','active','at_risk','on_hold','completed','archived')),
  health_score int not null default 50 check (health_score between 0 and 100),
  start_date date,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists documents (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  title text not null,
  type text not null check (type in
    ('srs','contract','invoice','scope_request','client_request','other')),
  source text not null check (source in ('upload','paste','demo','ai_generated')),
  content_preview text not null default '',
  file_name text,
  mime_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists documents_project_idx on documents(project_id);

create table if not exists analysis_outputs (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  document_id text references documents(id) on delete set null,
  type text not null check (type in
    ('project_intelligence','contract','invoice','scope','srs','business_case','general')),
  summary text not null,
  raw_output jsonb,
  created_at timestamptz not null default now()
);
create index if not exists analysis_project_idx on analysis_outputs(project_id);

create table if not exists actions (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  document_id text references documents(id) on delete set null,
  analysis_output_id text references analysis_outputs(id) on delete set null,
  title text not null,
  description text not null default '',
  status text not null default 'todo' check (status in ('todo','in_progress','done','blocked')),
  priority text not null default 'medium' check (priority in ('low','medium','high','critical')),
  owner text,
  due_date date,
  source_type text not null,
  created_at timestamptz not null default now()
);
create index if not exists actions_project_idx on actions(project_id);

create table if not exists risks (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  document_id text references documents(id) on delete set null,
  analysis_output_id text references analysis_outputs(id) on delete set null,
  title text not null,
  description text not null default '',
  severity text not null check (severity in ('low','medium','high','critical')),
  source text not null,
  impact text not null default '',
  suggested_action text not null default '',
  status text not null default 'open' check (status in ('open','monitoring','resolved')),
  created_at timestamptz not null default now()
);
create index if not exists risks_project_idx on risks(project_id);

create table if not exists approvals (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  document_id text references documents(id) on delete set null,
  analysis_output_id text references analysis_outputs(id) on delete set null,
  title text not null,
  description text not null default '',
  type text not null check (type in
    ('invoice','scope_change','contract','payment','delivery','other')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  approver text,
  amount numeric,
  currency text,
  reason text,
  created_at timestamptz not null default now()
);
create index if not exists approvals_project_idx on approvals(project_id);
