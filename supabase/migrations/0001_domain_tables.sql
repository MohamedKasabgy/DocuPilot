-- DocuPilot domain tables
-- Run once in Supabase SQL Editor before scripts/seed.ts.
-- Idempotent: CREATE TABLE IF NOT EXISTS, no destructive ALTERs.

create table if not exists projects (
  id              text primary key,
  name            text not null,
  client          text,
  status          text not null default 'On Track',
  health_score    int  not null default 0,
  delivery_date   date,
  risk_level      text not null default 'Low',
  description     text,
  created_at      timestamptz not null default now()
);

create table if not exists contracts (
  id              text primary key,
  project_id      text references projects(id) on delete cascade,
  title           text not null,
  client          text,
  vendor          text,
  total_value     numeric,
  currency        text default 'USD',
  effective_date  date,
  end_date        date,
  status          text not null default 'Active',
  created_at      timestamptz not null default now()
);

create table if not exists contract_deadlines (
  id              uuid primary key default gen_random_uuid(),
  contract_id     text references contracts(id) on delete cascade,
  title           text not null,
  due_date        date,
  priority        text not null default 'normal',
  days_left       int,
  type            text not null default 'upcoming',
  created_at      timestamptz not null default now()
);

create table if not exists tasks (
  id              uuid primary key default gen_random_uuid(),
  project_id      text references projects(id) on delete cascade,
  title           text not null,
  description     text,
  owner           text,
  status          text not null default 'In Progress',
  due_date        date,
  completed       boolean not null default false,
  created_at      timestamptz not null default now()
);

create table if not exists invoices (
  id              text primary key,
  project_id      text references projects(id) on delete cascade,
  vendor          text,
  description     text,
  amount          numeric not null,
  currency        text not null default 'USD',
  status          text not null default 'Pending',
  issue_date      date,
  due_date        date,
  payment_term    text,
  priority        text default 'normal',
  created_at      timestamptz not null default now()
);

create table if not exists invoice_approval_steps (
  id              uuid primary key default gen_random_uuid(),
  invoice_id      text references invoices(id) on delete cascade,
  step_order      int not null,
  role            text not null,
  state           text not null default 'step-pending',
  created_at      timestamptz not null default now()
);

create table if not exists risks (
  id              uuid primary key default gen_random_uuid(),
  project_id      text references projects(id) on delete cascade,
  title           text not null,
  severity        text not null default 'medium',
  source          text not null default 'contract',
  status          text not null default 'active',
  impact          text,
  exposure        text,
  owner           text,
  due_date        date,
  mitigation_notes text,
  created_at      timestamptz not null default now()
);

create table if not exists roadmap_milestones (
  id              uuid primary key default gen_random_uuid(),
  project_id      text references projects(id) on delete cascade,
  label           text not null,
  milestone_date  date,
  state           text not null default 'pending',
  is_current      boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists tasks_project_id_idx               on tasks(project_id);
create index if not exists invoices_project_id_idx            on invoices(project_id);
create index if not exists risks_project_id_idx               on risks(project_id);
create index if not exists roadmap_milestones_project_id_idx  on roadmap_milestones(project_id);
create index if not exists contract_deadlines_contract_id_idx on contract_deadlines(contract_id);
create index if not exists invoice_approval_steps_invoice_idx on invoice_approval_steps(invoice_id);
