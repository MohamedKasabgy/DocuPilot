// DocuPilot DB seed.
// Run: npm run db:seed   (or: npx tsx scripts/seed.ts)
//
// Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local.
// Service-role key bypasses RLS — never run this against a production DB
// with real customer data.

import 'dotenv/config';
import { config as dotenvConfig } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { resolve } from 'node:path';

import {
  PROJECTS, CONTRACTS, CONTRACT_DEADLINES, TASKS,
  INVOICES, INVOICE_APPROVAL_STEPS, RISKS, ROADMAP_MILESTONES,
  buildSrsRows, buildContractAnalysisRows, buildAiOutputRows, buildAlertRows,
} from './seed-data';

// dotenv/config loads .env; explicitly load .env.local too
dotenvConfig({ path: resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url) {
  console.error('[seed] missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}
if (!key) {
  console.error('[seed] missing SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Tables we own and reset before reseeding (children before parents).
const RESET_TABLES = [
  'document_chunks',
  'documents',
  'invoice_approval_steps',
  'invoices',
  'contract_deadlines',
  'contracts',
  'roadmap_milestones',
  'tasks',
  'risks',
  'alerts',
  'contract_analyses',
  'ai_outputs',
  'srs_documents',
  'projects',
];

async function reset() {
  for (const table of RESET_TABLES) {
    // Supabase requires a where clause for DELETE — match-all by id-not-null
    const { error } = await supabase.from(table).delete().not('id', 'is', null);
    if (error && !/does not exist/i.test(error.message)) {
      // Tolerate missing optional tables (documents/document_chunks may not exist yet)
      throw new Error(`reset(${table}): ${error.message}`);
    }
  }
  console.log('[seed] reset complete');
}

async function insert<T extends Record<string, unknown>>(table: string, rows: T[]) {
  if (rows.length === 0) return [];
  const { data, error } = await supabase.from(table).insert(rows).select();
  if (error) throw new Error(`insert(${table}): ${error.message}`);
  return data ?? [];
}

function pad(label: string, count: number) {
  console.log(`[seed] ${label.padEnd(28)} ${String(count).padStart(3)} rows`);
}

async function main() {
  const t0 = Date.now();

  await reset();

  await insert('projects', PROJECTS);
  pad('projects', PROJECTS.length);

  await insert('contracts', CONTRACTS);
  pad('contracts', CONTRACTS.length);

  await insert('contract_deadlines', CONTRACT_DEADLINES);
  pad('contract_deadlines', CONTRACT_DEADLINES.length);

  await insert('tasks', TASKS);
  pad('tasks', TASKS.length);

  await insert('invoices', INVOICES);
  pad('invoices', INVOICES.length);

  await insert('invoice_approval_steps', INVOICE_APPROVAL_STEPS);
  pad('invoice_approval_steps', INVOICE_APPROVAL_STEPS.length);

  await insert('risks', RISKS);
  pad('risks', RISKS.length);

  await insert('roadmap_milestones', ROADMAP_MILESTONES);
  pad('roadmap_milestones', ROADMAP_MILESTONES.length);

  const srsRows = buildSrsRows();
  await insert('srs_documents', srsRows);
  pad('srs_documents', srsRows.length);

  const caRows = buildContractAnalysisRows();
  const insertedCa = await insert<typeof caRows[number]>('contract_analyses', caRows);
  pad('contract_analyses', insertedCa.length);

  const aiOutputRows = buildAiOutputRows();
  await insert('ai_outputs', aiOutputRows);
  pad('ai_outputs', aiOutputRows.length);

  // Alerts reference the inserted contract_analyses rows by id
  const alertRows = buildAlertRows(
    insertedCa.map((row) => ({
      id:           row.id as string,
      project_id:   row.project_id as string,
      output_json:  row.output_json as typeof caRows[number]['output_json'],
    }))
  );
  await insert('alerts', alertRows);
  pad('alerts', alertRows.length);

  const ms = Date.now() - t0;
  console.log(`[seed] done in ${(ms / 1000).toFixed(2)}s`);
}

main().catch((err) => {
  console.error('[seed] FAILED');
  console.error(err);
  process.exit(1);
});
