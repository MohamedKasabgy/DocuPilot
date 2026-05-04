// Pure data arrays for the DocuPilot seed.
// All payloads conform to the Zod schemas in src/lib/ai/schemas/.

import type { SrsOutput } from '../src/lib/ai/schemas/srs';
import type { ContractAnalysisOutput } from '../src/lib/ai/schemas/contract';

// ── Projects ──────────────────────────────────────────────────────────────────

export const PROJECTS = [
  { id: 'NEX-2024-082', name: 'Al Waha Clinics',         client: 'Al Waha Healthcare Group', status: 'On Track',    health_score: 82, delivery_date: '2026-11-30', risk_level: 'Medium', description: 'Digital transformation: end-to-end patient booking and management ecosystem.' },
  { id: 'NEX-2024-091', name: 'DesignPro Rebrand',       client: 'DesignPro Studio',         status: 'In Progress', health_score: 68, delivery_date: '2026-08-15', risk_level: 'Low',    description: 'Full visual identity refresh and design system rollout.' },
  { id: 'NEX-2024-104', name: 'Legacy Integration v2',   client: 'HealthConnect Inc.',       status: 'At Risk',     health_score: 54, delivery_date: '2026-09-22', risk_level: 'High',   description: 'API bridge between legacy ERP and the new patient portal.' },
  { id: 'NEX-2025-007', name: 'OMNIMOBILE',              client: 'Omni Retail Co.',          status: 'On Track',    health_score: 79, delivery_date: '2026-12-10', risk_level: 'Medium', description: 'Cross-platform mobile app for in-store + online ordering.' },
  { id: 'NEX-2025-014', name: 'Acme Internal Portal',    client: 'Acme Corp',                status: 'On Track',    health_score: 88, delivery_date: '2026-07-30', risk_level: 'Low',    description: 'Internal tooling portal: HR, Finance, IT requests.' },
];

export const PROJECT_IDS = PROJECTS.map(p => p.id);

// ── Contracts ─────────────────────────────────────────────────────────────────

export const CONTRACTS = [
  { id: 'CON-2024-089', project_id: 'NEX-2024-082', title: 'Al Waha Clinics Master Agreement', client: 'Al Waha Healthcare Group', vendor: 'NexaSoft Solutions', total_value: 245000, currency: 'USD', effective_date: '2025-10-12', end_date: '2026-11-30', status: 'Active' },
  { id: 'CON-2024-091', project_id: 'NEX-2024-091', title: 'DesignPro Rebrand SOW',            client: 'DesignPro Studio',         vendor: 'NexaSoft Solutions', total_value:  82000, currency: 'USD', effective_date: '2026-01-08', end_date: '2026-08-15', status: 'Active' },
  { id: 'CON-2024-104', project_id: 'NEX-2024-104', title: 'Legacy Integration Engagement',    client: 'HealthConnect Inc.',       vendor: 'NexaSoft Solutions', total_value: 196000, currency: 'USD', effective_date: '2025-12-01', end_date: '2026-09-22', status: 'Active' },
  { id: 'CON-2025-007', project_id: 'NEX-2025-007', title: 'OMNIMOBILE Build Contract',        client: 'Omni Retail Co.',          vendor: 'NexaSoft Solutions', total_value: 312000, currency: 'USD', effective_date: '2026-02-14', end_date: '2026-12-10', status: 'Active' },
  { id: 'CON-2025-014', project_id: 'NEX-2025-014', title: 'Acme Portal Development',          client: 'Acme Corp',                vendor: 'NexaSoft Solutions', total_value: 124000, currency: 'USD', effective_date: '2026-03-01', end_date: '2026-07-30', status: 'Active' },
];

// ── Contract deadlines ────────────────────────────────────────────────────────

export const CONTRACT_DEADLINES = [
  { contract_id: 'CON-2024-089', title: 'Phase 1 Delivery',      due_date: '2026-06-15', priority: 'high',     days_left: 43, type: 'upcoming' },
  { contract_id: 'CON-2024-089', title: 'UAT Submission',         due_date: '2026-05-28', priority: 'critical', days_left: 25, type: 'upcoming' },
  { contract_id: 'CON-2024-089', title: 'Weekly Status Report',   due_date: '2026-05-09', priority: 'normal',   days_left:  6, type: 'urgent'   },

  { contract_id: 'CON-2024-091', title: 'Brand Guidelines Draft', due_date: '2026-05-20', priority: 'high',     days_left: 17, type: 'upcoming' },
  { contract_id: 'CON-2024-091', title: 'Logo Sign-off',          due_date: '2026-06-05', priority: 'high',     days_left: 33, type: 'upcoming' },
  { contract_id: 'CON-2024-091', title: 'Final Asset Handoff',    due_date: '2026-08-10', priority: 'critical', days_left: 99, type: 'upcoming' },

  { contract_id: 'CON-2024-104', title: 'API Specification',      due_date: '2026-05-15', priority: 'critical', days_left: 12, type: 'urgent'   },
  { contract_id: 'CON-2024-104', title: 'Integration Testing',    due_date: '2026-07-20', priority: 'high',     days_left: 78, type: 'upcoming' },
  { contract_id: 'CON-2024-104', title: 'Cutover Window',         due_date: '2026-09-15', priority: 'critical', days_left:135, type: 'upcoming' },

  { contract_id: 'CON-2025-007', title: 'iOS Build Submission',   due_date: '2026-09-30', priority: 'high',     days_left:150, type: 'upcoming' },
  { contract_id: 'CON-2025-007', title: 'Android Beta',           due_date: '2026-08-15', priority: 'high',     days_left:104, type: 'upcoming' },
  { contract_id: 'CON-2025-007', title: 'Store Launch',           due_date: '2026-12-01', priority: 'critical', days_left:212, type: 'upcoming' },

  { contract_id: 'CON-2025-014', title: 'HR Module Demo',         due_date: '2026-05-22', priority: 'normal',   days_left: 19, type: 'upcoming' },
  { contract_id: 'CON-2025-014', title: 'Finance Module Demo',    due_date: '2026-06-12', priority: 'high',     days_left: 40, type: 'upcoming' },
  { contract_id: 'CON-2025-014', title: 'Production Cutover',     due_date: '2026-07-25', priority: 'critical', days_left: 83, type: 'upcoming' },
];

// ── Tasks ─────────────────────────────────────────────────────────────────────

export const TASKS = [
  { project_id: 'NEX-2024-082', title: 'Patient Dashboard UI Refinement',     description: 'Front-end Development · V2.1',  owner: 'AM', status: 'In Progress', due_date: '2026-05-04', completed: false },
  { project_id: 'NEX-2024-082', title: 'Payment Gateway Integration',         description: 'Back-end · API Services',        owner: 'SJ', status: 'Blocked',     due_date: '2026-05-18', completed: false },
  { project_id: 'NEX-2024-082', title: 'Database Schema Finalization',        description: 'DevOps · Architecture',          owner: 'RK', status: 'Done',        due_date: '2026-05-10', completed: true  },
  { project_id: 'NEX-2024-082', title: 'HIPAA Compliance Review',             description: 'Security · Compliance',          owner: 'AM', status: 'In Progress', due_date: '2026-06-01', completed: false },

  { project_id: 'NEX-2024-091', title: 'Mood Board v3',                       description: 'Design · Discovery',             owner: 'LC', status: 'Done',        due_date: '2026-04-22', completed: true  },
  { project_id: 'NEX-2024-091', title: 'Logo Mark Iteration',                 description: 'Design · Identity',              owner: 'LC', status: 'In Progress', due_date: '2026-05-11', completed: false },
  { project_id: 'NEX-2024-091', title: 'Stationery System',                   description: 'Design · Print',                 owner: 'JW', status: 'In Progress', due_date: '2026-06-04', completed: false },

  { project_id: 'NEX-2024-104', title: 'Legacy ERP Endpoint Mapping',         description: 'Integration · Discovery',        owner: 'SJ', status: 'In Progress', due_date: '2026-05-15', completed: false },
  { project_id: 'NEX-2024-104', title: 'Auth Token Bridge',                   description: 'Security · Auth',                owner: 'AK', status: 'Blocked',     due_date: '2026-05-25', completed: false },
  { project_id: 'NEX-2024-104', title: 'Data Migration Dry-run',              description: 'DevOps · Data',                  owner: 'RK', status: 'In Progress', due_date: '2026-06-12', completed: false },
  { project_id: 'NEX-2024-104', title: 'Smoke Test Suite',                    description: 'QA · Automation',                owner: 'JW', status: 'In Progress', due_date: '2026-06-20', completed: false },

  { project_id: 'NEX-2025-007', title: 'Cart Sync — Online ⇄ POS',            description: 'Mobile · Sync',                  owner: 'AM', status: 'In Progress', due_date: '2026-06-10', completed: false },
  { project_id: 'NEX-2025-007', title: 'Push Notification Pipeline',          description: 'Backend · Notifications',        owner: 'SJ', status: 'In Progress', due_date: '2026-06-18', completed: false },
  { project_id: 'NEX-2025-007', title: 'iOS Test Flight Distribution',        description: 'DevOps · Mobile',                owner: 'RK', status: 'Done',        due_date: '2026-04-30', completed: true  },
  { project_id: 'NEX-2025-007', title: 'Loyalty Module Spike',                description: 'Product · Spike',                owner: 'AK', status: 'In Progress', due_date: '2026-07-05', completed: false },

  { project_id: 'NEX-2025-014', title: 'HR Module — Employee Directory',     description: 'Frontend · Module',              owner: 'LC', status: 'In Progress', due_date: '2026-05-20', completed: false },
  { project_id: 'NEX-2025-014', title: 'IT Request Workflow',                 description: 'Backend · Workflow',             owner: 'JW', status: 'In Progress', due_date: '2026-06-02', completed: false },
  { project_id: 'NEX-2025-014', title: 'SSO Integration',                     description: 'Security · SSO',                 owner: 'AK', status: 'In Progress', due_date: '2026-06-15', completed: false },
  { project_id: 'NEX-2025-014', title: 'Audit Log Plumbing',                  description: 'Backend · Audit',                owner: 'SJ', status: 'Done',        due_date: '2026-04-25', completed: true  },
];

// ── Invoices ──────────────────────────────────────────────────────────────────

export const INVOICES = [
  { id: 'INV-2026-040', project_id: 'NEX-2024-082', vendor: 'NexaSoft Solutions', description: 'Phase 1 — Discovery',          amount: 48000.00, currency: 'USD', status: 'Paid',    issue_date: '2026-02-10', due_date: '2026-03-10', payment_term: 'Net 30', priority: 'normal'   },
  { id: 'INV-2026-041', project_id: 'NEX-2024-082', vendor: 'NexaSoft Solutions', description: 'Phase 2 — UI/UX Design',        amount: 36500.00, currency: 'USD', status: 'Paid',    issue_date: '2026-03-15', due_date: '2026-04-14', payment_term: 'Net 30', priority: 'normal'   },
  { id: 'INV-2026-042', project_id: 'NEX-2024-082', vendor: 'DesignPro Studio',   description: 'UI Design — Milestone 2',       amount:  6500.00, currency: 'SAR', status: 'Pending', issue_date: '2026-05-01', due_date: '2026-05-15', payment_term: 'Net 15', priority: 'urgent'   },
  { id: 'INV-2026-043', project_id: 'NEX-2024-082', vendor: 'CloudOps Ltd.',      description: 'Infrastructure — Q2',           amount:  4200.00, currency: 'USD', status: 'Pending', issue_date: '2026-04-28', due_date: '2026-05-28', payment_term: 'Net 30', priority: 'normal'   },

  { id: 'INV-2026-051', project_id: 'NEX-2024-091', vendor: 'DesignPro Studio',   description: 'Brand Discovery Sprint',        amount: 12000.00, currency: 'USD', status: 'Paid',    issue_date: '2026-02-20', due_date: '2026-03-22', payment_term: 'Net 30', priority: 'normal'   },
  { id: 'INV-2026-052', project_id: 'NEX-2024-091', vendor: 'DesignPro Studio',   description: 'Identity Iteration v2',         amount:  8500.00, currency: 'USD', status: 'Pending', issue_date: '2026-04-30', due_date: '2026-05-30', payment_term: 'Net 30', priority: 'normal'   },

  { id: 'INV-2026-060', project_id: 'NEX-2024-104', vendor: 'NexaSoft Solutions', description: 'Integration Discovery',         amount: 22000.00, currency: 'USD', status: 'Paid',    issue_date: '2026-01-15', due_date: '2026-02-14', payment_term: 'Net 30', priority: 'normal'   },
  { id: 'INV-2026-061', project_id: 'NEX-2024-104', vendor: 'NexaSoft Solutions', description: 'API Specification Phase',        amount: 18500.00, currency: 'USD', status: 'Pending', issue_date: '2026-04-22', due_date: '2026-05-22', payment_term: 'Net 30', priority: 'critical' },
  { id: 'INV-2026-062', project_id: 'NEX-2024-104', vendor: 'NexaSoft Solutions', description: 'Auth Module Implementation',     amount: 15800.00, currency: 'USD', status: 'Rejected',issue_date: '2026-04-05', due_date: '2026-05-05', payment_term: 'Net 30', priority: 'normal'   },

  { id: 'INV-2026-070', project_id: 'NEX-2025-007', vendor: 'NexaSoft Solutions', description: 'OMNIMOBILE — Sprint 1',         amount: 28000.00, currency: 'USD', status: 'Paid',    issue_date: '2026-03-10', due_date: '2026-04-09', payment_term: 'Net 30', priority: 'normal'   },
  { id: 'INV-2026-071', project_id: 'NEX-2025-007', vendor: 'NexaSoft Solutions', description: 'OMNIMOBILE — Sprint 2',         amount: 28000.00, currency: 'USD', status: 'Pending', issue_date: '2026-04-25', due_date: '2026-05-25', payment_term: 'Net 30', priority: 'urgent'   },
  { id: 'INV-2026-072', project_id: 'NEX-2025-007', vendor: 'AppleStore Setup',   description: 'Developer Programs',            amount:   299.00, currency: 'USD', status: 'Paid',    issue_date: '2026-03-01', due_date: '2026-03-15', payment_term: 'Net 15', priority: 'normal'   },

  { id: 'INV-2026-080', project_id: 'NEX-2025-014', vendor: 'NexaSoft Solutions', description: 'Acme Portal — Kickoff Sprint',  amount: 24500.00, currency: 'USD', status: 'Paid',    issue_date: '2026-03-20', due_date: '2026-04-19', payment_term: 'Net 30', priority: 'normal'   },
  { id: 'INV-2026-081', project_id: 'NEX-2025-014', vendor: 'NexaSoft Solutions', description: 'Acme Portal — HR Module',        amount: 21000.00, currency: 'USD', status: 'Pending', issue_date: '2026-05-01', due_date: '2026-05-31', payment_term: 'Net 30', priority: 'normal'   },
];

// ── Invoice approval steps ────────────────────────────────────────────────────

export const INVOICE_APPROVAL_STEPS = [
  // INV-2026-042 — escalated (>5000 SAR threshold)
  { invoice_id: 'INV-2026-042', step_order: 1, role: 'PM Review',        state: 'step-done'    },
  { invoice_id: 'INV-2026-042', step_order: 2, role: 'Finance Review',   state: 'step-active'  },
  { invoice_id: 'INV-2026-042', step_order: 3, role: 'Finance Director', state: 'step-pending' },
  { invoice_id: 'INV-2026-042', step_order: 4, role: 'CFO Approval',     state: 'step-pending' },

  // INV-2026-043 — small, normal flow
  { invoice_id: 'INV-2026-043', step_order: 1, role: 'PM Review',        state: 'step-done'    },
  { invoice_id: 'INV-2026-043', step_order: 2, role: 'Finance Review',   state: 'step-active'  },
  { invoice_id: 'INV-2026-043', step_order: 3, role: 'Approved',         state: 'step-pending' },

  // INV-2026-052
  { invoice_id: 'INV-2026-052', step_order: 1, role: 'PM Review',        state: 'step-done'    },
  { invoice_id: 'INV-2026-052', step_order: 2, role: 'Finance Review',   state: 'step-active'  },
  { invoice_id: 'INV-2026-052', step_order: 3, role: 'Approved',         state: 'step-pending' },

  // INV-2026-061 — escalated
  { invoice_id: 'INV-2026-061', step_order: 1, role: 'PM Review',        state: 'step-done'    },
  { invoice_id: 'INV-2026-061', step_order: 2, role: 'Finance Review',   state: 'step-done'    },
  { invoice_id: 'INV-2026-061', step_order: 3, role: 'Finance Director', state: 'step-active'  },
  { invoice_id: 'INV-2026-061', step_order: 4, role: 'CFO Approval',     state: 'step-pending' },

  // INV-2026-071
  { invoice_id: 'INV-2026-071', step_order: 1, role: 'PM Review',        state: 'step-done'    },
  { invoice_id: 'INV-2026-071', step_order: 2, role: 'Finance Review',   state: 'step-active'  },
  { invoice_id: 'INV-2026-071', step_order: 3, role: 'Finance Director', state: 'step-pending' },

  // INV-2026-081
  { invoice_id: 'INV-2026-081', step_order: 1, role: 'PM Review',        state: 'step-done'    },
  { invoice_id: 'INV-2026-081', step_order: 2, role: 'Finance Review',   state: 'step-active'  },
  { invoice_id: 'INV-2026-081', step_order: 3, role: 'Approved',         state: 'step-pending' },
];

// ── Risks ─────────────────────────────────────────────────────────────────────

export const RISKS = [
  { project_id: 'NEX-2024-082', title: 'Late delivery penalty — Clinic Booking Platform',          severity: 'high',   source: 'contract', status: 'active',    impact: 'Immediate Q4 revenue reduction', exposure: 'Penalty 10%',          owner: 'Ahmad K.',  due_date: '2026-05-15', mitigation_notes: null },
  { project_id: 'NEX-2024-082', title: 'Out-of-scope mobile app request',                          severity: 'high',   source: 'scope',    status: 'active',    impact: 'Estimated 80 extra dev hours',   exposure: '$18,000 unbilled',     owner: 'Unassigned', due_date: '2026-05-10', mitigation_notes: null },
  { project_id: 'NEX-2024-082', title: 'Invoice pending approval — DesignPro',                     severity: 'medium', source: 'finance',  status: 'active',    impact: 'Payment cycle at risk',          exposure: 'Cash flow gap',        owner: 'Sara M.',   due_date: '2026-05-12', mitigation_notes: null },
  { project_id: 'NEX-2024-082', title: 'Missing client confirmation on API docs',                  severity: 'medium', source: 'contract', status: 'active',    impact: 'Sprint kickoff at risk',         exposure: '1 sprint delay',       owner: 'Unassigned', due_date: '2026-05-20', mitigation_notes: null },

  { project_id: 'NEX-2024-091', title: 'Brand asset approval bottleneck',                          severity: 'low',    source: 'scope',    status: 'mitigated', impact: 'Minor delay in handoff',         exposure: '3 day delay',          owner: 'Lin C.',    due_date: '2026-05-25', mitigation_notes: 'Added weekly review checkpoint with client' },
  { project_id: 'NEX-2024-091', title: 'Vendor invoice tax ID missing',                            severity: 'medium', source: 'finance',  status: 'active',    impact: 'Invoice cannot be processed',    exposure: 'Payment held',         owner: 'Sara M.',   due_date: '2026-05-18', mitigation_notes: null },

  { project_id: 'NEX-2024-104', title: 'Legacy ERP credentials not provided',                      severity: 'high',   source: 'contract', status: 'active',    impact: 'Blocks integration testing',     exposure: '2 week slip',          owner: 'Sara M.',   due_date: '2026-05-22', mitigation_notes: null },
  { project_id: 'NEX-2024-104', title: 'Data quality issues in source ERP',                        severity: 'high',   source: 'scope',    status: 'active',    impact: 'Migration cleansing required',   exposure: '+40 dev hours',        owner: 'James W.',  due_date: '2026-06-05', mitigation_notes: null },

  { project_id: 'NEX-2025-007', title: 'iOS App Store review timing',                              severity: 'medium', source: 'contract', status: 'active',    impact: 'Launch slip if reviewed late',   exposure: '1 week delay',         owner: 'Ahmad K.',  due_date: '2026-09-20', mitigation_notes: null },
  { project_id: 'NEX-2025-007', title: 'Push notification volume cost overrun',                    severity: 'low',    source: 'finance',  status: 'active',    impact: 'Higher infra costs',             exposure: '+$1,800/mo',           owner: 'Lin C.',    due_date: '2026-08-01', mitigation_notes: null },

  { project_id: 'NEX-2025-014', title: 'SSO IdP version mismatch',                                 severity: 'medium', source: 'contract', status: 'active',    impact: 'Auth flow blocked',              exposure: '+1 sprint',            owner: 'James W.',  due_date: '2026-06-10', mitigation_notes: null },
  { project_id: 'NEX-2025-014', title: 'Audit log retention compliance',                           severity: 'low',    source: 'scope',    status: 'mitigated', impact: 'Compliance gap if not stored',   exposure: 'Audit finding',        owner: 'Sara M.',   due_date: '2026-06-25', mitigation_notes: 'Configured 7-year retention bucket' },
];

// ── Roadmap milestones ────────────────────────────────────────────────────────

export const ROADMAP_MILESTONES = [
  // Al Waha
  { project_id: 'NEX-2024-082', label: 'Kickoff',         milestone_date: '2025-10-12', state: 'completed', is_current: false },
  { project_id: 'NEX-2024-082', label: 'SRS Freeze',      milestone_date: '2025-10-28', state: 'completed', is_current: false },
  { project_id: 'NEX-2024-082', label: 'UAT Phase',       milestone_date: '2026-11-15', state: 'active',    is_current: true  },
  { project_id: 'NEX-2024-082', label: 'Security Audit',  milestone_date: '2026-11-22', state: 'pending',   is_current: false },
  { project_id: 'NEX-2024-082', label: 'Deployment',      milestone_date: '2026-11-30', state: 'pending',   is_current: false },

  // DesignPro Rebrand
  { project_id: 'NEX-2024-091', label: 'Discovery',       milestone_date: '2026-02-10', state: 'completed', is_current: false },
  { project_id: 'NEX-2024-091', label: 'Concept Phase',   milestone_date: '2026-04-12', state: 'completed', is_current: false },
  { project_id: 'NEX-2024-091', label: 'Identity Design', milestone_date: '2026-06-05', state: 'active',    is_current: true  },
  { project_id: 'NEX-2024-091', label: 'Asset Production',milestone_date: '2026-07-18', state: 'pending',   is_current: false },
  { project_id: 'NEX-2024-091', label: 'Final Handoff',   milestone_date: '2026-08-15', state: 'pending',   is_current: false },

  // Legacy Integration
  { project_id: 'NEX-2024-104', label: 'Discovery',       milestone_date: '2026-01-15', state: 'completed', is_current: false },
  { project_id: 'NEX-2024-104', label: 'API Spec',        milestone_date: '2026-05-15', state: 'active',    is_current: true  },
  { project_id: 'NEX-2024-104', label: 'Implementation',  milestone_date: '2026-07-20', state: 'pending',   is_current: false },
  { project_id: 'NEX-2024-104', label: 'Cutover',         milestone_date: '2026-09-22', state: 'pending',   is_current: false },

  // OMNIMOBILE
  { project_id: 'NEX-2025-007', label: 'Sprint 0',        milestone_date: '2026-03-01', state: 'completed', is_current: false },
  { project_id: 'NEX-2025-007', label: 'MVP Build',       milestone_date: '2026-07-15', state: 'active',    is_current: true  },
  { project_id: 'NEX-2025-007', label: 'Beta Release',    milestone_date: '2026-09-15', state: 'pending',   is_current: false },
  { project_id: 'NEX-2025-007', label: 'Store Launch',    milestone_date: '2026-12-10', state: 'pending',   is_current: false },

  // Acme Portal
  { project_id: 'NEX-2025-014', label: 'Kickoff',         milestone_date: '2026-03-01', state: 'completed', is_current: false },
  { project_id: 'NEX-2025-014', label: 'Module Build',    milestone_date: '2026-06-10', state: 'active',    is_current: true  },
  { project_id: 'NEX-2025-014', label: 'Production Go-Live', milestone_date: '2026-07-30', state: 'pending', is_current: false },
];

// ── SRS payload (one valid SrsOutput, varied per row) ─────────────────────────

const SRS_TEMPLATE: SrsOutput = {
  projectBrief: {
    projectName: 'Clinic Booking Platform',
    clientName: 'Al Waha Healthcare Group',
    industry: 'Healthcare',
    complexity: 'medium',
    summary: 'Patient booking and management ecosystem covering web booking, admin dashboard, appointment management, notifications, and basic reporting.',
  },
  userRoles: [
    { role: 'Patient',          description: 'End user booking and managing appointments.',                permissions: ['book_appointment', 'view_history', 'cancel_appointment'] },
    { role: 'Receptionist',      description: 'Manages walk-ins and same-day reschedules.',                 permissions: ['view_calendar', 'reschedule', 'block_slot']               },
    { role: 'Doctor',            description: 'Reviews schedule and patient context.',                       permissions: ['view_schedule', 'add_notes']                              },
    { role: 'Clinic Admin',      description: 'Manages doctors, services, and reports.',                     permissions: ['manage_users', 'manage_services', 'view_reports']         },
  ],
  mainFeatures: [
    { title: 'Online booking',          description: 'Patients can book any available slot.',                priority: 'critical' },
    { title: 'Appointment reminders',   description: 'SMS/email 24h and 1h before appointment.',             priority: 'high'     },
    { title: 'Admin dashboard',         description: 'Per-clinic overview of bookings and KPIs.',            priority: 'high'     },
    { title: 'Reporting',               description: 'Weekly booking volume and cancellation rates.',         priority: 'medium'   },
  ],
  functionalRequirements: [
    { id: 'FR-01', title: 'Real-time slot verification',        description: 'No double bookings; 5-minute hold during checkout.', priority: 'critical' },
    { id: 'FR-02', title: 'Automated reminders (SMS/Email)',    description: '24h and 1h before each appointment.',                priority: 'high'     },
    { id: 'FR-03', title: 'Admin override',                      description: 'Admins can move/cancel/block any slot.',             priority: 'high'     },
    { id: 'FR-04', title: 'Performance analytics',              description: 'Weekly KPI report.',                                  priority: 'medium'   },
    { id: 'FR-05', title: 'Multi-doctor schedules',              description: 'Concurrent calendars with conflict detection.',       priority: 'high'     },
  ],
  nonFunctionalRequirements: [
    { category: 'Performance', requirement: 'p95 booking latency < 1.5s under 500 concurrent users.' },
    { category: 'Compliance',  requirement: 'HIPAA-aligned storage of patient data at rest and in transit.' },
    { category: 'Availability', requirement: '99.9% uptime SLO during clinic hours.' },
  ],
  missingQuestions: [
    'Are bookings limited to a single clinic chain, or multi-tenant?',
    'Is there an existing EMR system to integrate with?',
    'What payment provider is required (Stripe, MyFatoorah, etc.)?',
    'Are SMS notifications expected via local Saudi providers?',
  ],
  mvpScope: [
    'Phase 1: Public booking + admin dashboard',
    'Phase 2: Reminders + reporting',
    'Phase 3: EMR integration + payments',
  ],
  assumptions: [
    'Admin users will be onboarded directly by NexaSoft.',
    'All clinics share the same tenant in v1.',
    'English-only UI for MVP; Arabic support in v2.',
  ],
  confidenceScore: 78,
};

const SRS_VARIANTS: { clientRequest: string; confidenceScore: number; projectIdx: number }[] = [
  { clientRequest: 'نحتاج نظام حجوزات للعيادات يشمل موقع للحجز، لوحة تحكم للإدارة، إدارة المواعيد، إشعارات للمراجعين، وتقارير بسيطة للإدارة.', confidenceScore: 78, projectIdx: 0 },
  { clientRequest: 'We want a full rebrand including logo, brand guidelines, stationery, and a small design system for the website.',         confidenceScore: 86, projectIdx: 1 },
  { clientRequest: 'Need an integration layer between our legacy ERP and the new patient portal — must support OAuth and audit logging.',     confidenceScore: 71, projectIdx: 2 },
  { clientRequest: 'Cross-platform mobile app: iOS + Android, with cart sync between online and in-store, push notifications, and loyalty.',  confidenceScore: 82, projectIdx: 3 },
  { clientRequest: 'Internal tooling portal for HR, Finance, and IT request workflows. Must integrate with our SSO.',                          confidenceScore: 88, projectIdx: 4 },
  { clientRequest: 'Add online payment to existing booking flow — Mada, Apple Pay, and credit cards.',                                         confidenceScore: 74, projectIdx: 0 },
  { clientRequest: 'Add an Arabic-language patient mobile app to the booking system.',                                                         confidenceScore: 65, projectIdx: 0 },
  { clientRequest: 'Migrate brand assets from current vendor to a new DAM platform.',                                                          confidenceScore: 80, projectIdx: 1 },
  { clientRequest: 'Reverse engineer the legacy ERP API and publish an OpenAPI spec.',                                                          confidenceScore: 60, projectIdx: 2 },
  { clientRequest: 'Add in-app loyalty points and redemption flow for OMNIMOBILE.',                                                             confidenceScore: 77, projectIdx: 3 },
  { clientRequest: 'Build an audit log explorer page with filtering and CSV export.',                                                           confidenceScore: 90, projectIdx: 4 },
  { clientRequest: 'Add HIPAA-compliant patient export (PDF + JSON) to the clinic platform.',                                                   confidenceScore: 72, projectIdx: 0 },
  { clientRequest: 'Refresh the design system tokens across all NexaSoft products.',                                                            confidenceScore: 84, projectIdx: 1 },
  { clientRequest: 'Add a real-time SLA dashboard for the legacy integration.',                                                                  confidenceScore: 68, projectIdx: 2 },
  { clientRequest: 'Add inventory sync between stores for OMNIMOBILE.',                                                                          confidenceScore: 79, projectIdx: 3 },
];

export function buildSrsRows() {
  return SRS_VARIANTS.map(v => ({
    project_id:       PROJECT_IDS[v.projectIdx],
    client_request:   v.clientRequest,
    output_json:      { ...SRS_TEMPLATE, confidenceScore: v.confidenceScore },
    confidence_score: v.confidenceScore,
  }));
}

// ── Contract analysis payload (one valid ContractAnalysisOutput, varied) ─────

const CONTRACT_TEMPLATE: ContractAnalysisOutput = {
  contractTitle: 'Software Development Agreement',
  projectName: 'Clinic Booking Platform',
  clientName: 'Al Waha Healthcare Group',
  parties: [
    { name: 'Al Waha Healthcare Group', role: 'client' },
    { name: 'NexaSoft Solutions',       role: 'vendor' },
  ],
  scope: {
    summary: 'Design, develop, and deliver a web platform and admin dashboard for managing patient bookings.',
    included: ['Web Application', 'Admin Dashboard', 'REST API', 'Reporting Module'],
    excluded: ['Native iOS app', 'Native Android app', 'On-premise hosting'],
  },
  deliverables: [
    { title: 'Web Application',   description: 'Patient-facing booking site.',         dueDate: '2026-08-01', sourceQuote: 'Vendor shall design, develop, and deliver a web application' },
    { title: 'Admin Dashboard',   description: 'Operations dashboard for clinics.',     dueDate: '2026-08-15', sourceQuote: 'managing customer appointments and internal reports'         },
    { title: 'REST API',           description: 'Public + internal API surface.',         dueDate: '2026-09-01', sourceQuote: 'including HIPAA-compliant storage and Stripe checkout'      },
  ],
  deadlines: [
    { title: 'Beta Delivery',  dueDate: null, relativeTimeline: '6 weeks from kickoff',   consequenceIfMissed: 'Delays final acceptance', priority: 'high',     sourceQuote: 'A beta version must be delivered within 6 weeks.' },
    { title: 'Final Delivery', dueDate: null, relativeTimeline: '12 weeks from kickoff',  consequenceIfMissed: '5% weekly penalty after 7 days', priority: 'critical', sourceQuote: 'Final delivery must be completed within 12 weeks.' },
  ],
  payments: [
    { title: 'Upfront Payment',     trigger: 'On signing',          percentage: '50%', amount: '$25,000', dueDate: null, sourceQuote: 'Payment terms are 50% on signing'        },
    { title: 'Final Payment',       trigger: 'On final delivery',    percentage: '50%', amount: '$25,000', dueDate: null, sourceQuote: 'and 50% on final delivery'                },
  ],
  obligations: [
    { title: 'Weekly Status Reports', owner: 'vendor', description: 'Submit weekly status updates to client PM.',     suggestedAction: 'Add recurring task',         severity: 'medium',  sourceQuote: 'every Friday by 5:00 PM' },
    { title: 'Change Approval',        owner: 'both',   description: 'All scope changes require written approval.',     suggestedAction: 'Set up CR approval flow',    severity: 'high',    sourceQuote: 'require written client approval before work begins' },
  ],
  risks: [
    { title: 'Late delivery penalty', severity: 'high',     category: 'delivery', impact: '5% weekly fee compounds rapidly',                       reason: 'Tight 12-week timeline',           suggestedAction: 'Build 1-week buffer into schedule',  sourceQuote: 'Late delivery beyond 7 days incurs a 5% weekly penalty.' },
    { title: 'Scope creep — mobile',  severity: 'critical', category: 'scope',    impact: 'Significant unbilled work if mobile work is performed', reason: 'Mobile explicitly excluded',        suggestedAction: 'Reject any mobile work without CR',   sourceQuote: 'mobile apps, payment gateway integration, or advanced analytics' },
  ],
  changeRequestTerms: {
    requiresWrittenApproval: true,
    summary: 'All scope changes require written client approval before work begins.',
    sourceQuote: 'require written client approval before work begins.',
  },
  suggestedActions: [
    { type: 'create_payment_milestone', title: 'Schedule kickoff payment',        description: 'Generate $25,000 invoice on signing.',          priority: 'high'     },
    { type: 'create_risk',              title: 'Late-delivery penalty risk',       description: 'Track 7-day buffer status weekly.',              priority: 'critical' },
    { type: 'create_approval',          title: 'Set up CR approval flow',           description: 'Required for any scope addition.',                priority: 'high'     },
    { type: 'create_task',              title: 'Recurring weekly status update',   description: 'Friday 5pm status summary to client PM.',         priority: 'medium'   },
  ],
  executiveSummary: '12-week fixed-fee development of a web platform and admin dashboard. Strict scope around web only. 50/50 payment with a 5% weekly late-delivery penalty after 7 days. CRs require written approval.',
  confidenceScore: 92,
};

export function buildContractAnalysisRows() {
  return CONTRACTS.map((c, i) => ({
    project_id:       c.project_id,
    contract_text:    `[${c.id}] ${c.title} — between ${c.client} and ${c.vendor}. Total value ${c.total_value}. Effective ${c.effective_date} through ${c.end_date}.`,
    output_json:      { ...CONTRACT_TEMPLATE, contractTitle: c.title, projectName: PROJECTS[i]?.name ?? c.title, clientName: c.client },
    confidence_score: 88 + (i % 5),
  }));
}

// ── AI outputs ────────────────────────────────────────────────────────────────

export function buildAiOutputRows() {
  const srsRows = buildSrsRows().map(r => ({ project_id: r.project_id, type: 'srs',                json: r.output_json }));
  const caRows  = buildContractAnalysisRows().map(r => ({ project_id: r.project_id, type: 'contract_analysis', json: r.output_json }));
  return [...srsRows, ...caRows];
}

// ── Alerts (built per contract analysis) ──────────────────────────────────────

export function buildAlertRows(contractAnalyses: { id: string; project_id: string; output_json: ContractAnalysisOutput }[]) {
  const rows: Array<{
    project_id: string; source_type: string; source_id: string;
    title: string; message: string; severity: string; status: string;
  }> = [];

  for (const ca of contractAnalyses) {
    for (const risk of ca.output_json.risks) {
      rows.push({
        project_id:  ca.project_id,
        source_type: 'contract',
        source_id:   ca.id,
        title:       risk.title,
        message:     risk.impact,
        severity:    risk.severity,
        status:      'open',
      });
    }
    for (const dl of ca.output_json.deadlines) {
      rows.push({
        project_id:  ca.project_id,
        source_type: 'contract_deadline',
        source_id:   ca.id,
        title:       dl.title,
        message:     dl.consequenceIfMissed ?? dl.relativeTimeline ?? 'Deadline approaching',
        severity:    dl.priority === 'critical' ? 'critical' : dl.priority === 'high' ? 'high' : 'medium',
        status:      'open',
      });
    }
  }
  return rows;
}
