import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/db/supabaseAdmin";

export interface ContractListItem {
  id: string;
  title: string;
  client: string | null;
  vendor: string | null;
  total_value: number | null;
  currency: string | null;
  status: string | null;
  /** One-paragraph scope summary (from contract analysis if available). */
  scope_summary?: string | null;
  /** Items explicitly excluded from scope. */
  scope_excluded?: string[] | null;
  /** Human-readable payment milestone labels. */
  payment_milestones?: string[] | null;
  /** Change request / amendment policy summary. */
  change_request_terms?: string | null;
}

const DEMO_CONTRACTS: ContractListItem[] = [
  {
    id: "CP-2026-88",
    title: "Clinic Booking Platform Development Agreement",
    client: "Al Waha Clinics",
    vendor: "NexaSoft Solutions",
    total_value: 150000,
    currency: "SAR",
    status: "Active",
    scope_summary:
      "Development of a full-stack clinic booking platform including patient-facing website, admin dashboard, and API integration layer. Project duration is 8 weeks.",
    scope_excluded: [
      "Mobile application development",
      "Third-party payment gateway integration",
      "Hardware procurement",
    ],
    payment_milestones: [
      "40% on contract signing — 60,000 SAR",
      "30% on beta delivery (week 4) — 45,000 SAR",
      "30% on final delivery (week 8) — 45,000 SAR",
    ],
    change_request_terms:
      "All additions outside the agreed scope require written change request approval before work begins. A 10% penalty applies if delivery is delayed more than 7 days without an accepted reason.",
  },
  {
    id: "CP-2026-45",
    title: "Mobile App UI Design Services",
    client: "Al Waha Clinics",
    vendor: "DesignPro Studio",
    total_value: 45000,
    currency: "SAR",
    status: "Active",
    scope_summary:
      "UI/UX design for the Clinic Booking Platform mobile app across 3 milestones: wireframes, visual design, and clickable prototype.",
    scope_excluded: [
      "Frontend development or coding",
      "Backend API work",
      "Testing or QA",
      "Web (desktop) design",
    ],
    payment_milestones: [
      "Milestone 1 — Wireframes & Information Architecture: 15,000 SAR",
      "Milestone 2 — Visual Design & Style Guide: 15,000 SAR",
      "Milestone 3 — Clickable Prototype & Handoff: 15,000 SAR",
    ],
    change_request_terms:
      "Design revisions are limited to 2 rounds per milestone. Additional revisions or new screens beyond scope require a signed change order at 500 SAR/screen.",
  },
  {
    id: "CP-2025-12",
    title: "Infrastructure & DevOps Retainer",
    client: "Al Waha Clinics",
    vendor: "CloudOps Arabia",
    total_value: 80000,
    currency: "SAR",
    status: "Active",
    scope_summary:
      "12-month retainer for cloud infrastructure management, CI/CD pipeline maintenance, and 24/7 on-call support for production environments hosted on AWS.",
    scope_excluded: [
      "Application development",
      "UI/UX design",
      "Data migration or ETL pipelines",
      "Security audits",
    ],
    payment_milestones: [
      "Monthly retainer: 6,667 SAR/month (12-month term, invoiced on the 1st of each month)",
    ],
    change_request_terms:
      "Additional out-of-scope services are billed at 350 SAR/hour and require written approval before engagement.",
  },
];

export async function GET() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from("contracts")
        .select("id, title, client, vendor, total_value, currency, status")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        // Supabase contracts don't carry extended scope/milestone fields from the DB schema.
        // Return them as-is; extended fields will be null (callers handle this gracefully).
        return NextResponse.json({ success: true, source: "supabase", data });
      }
      if (error) {
        console.warn("[Contracts/list] Supabase query failed (non-blocking):", error);
      }
    } catch (dbError) {
      console.warn("[Contracts/list] Supabase error (non-blocking):", dbError);
    }
  }

  return NextResponse.json({ success: true, source: "demo", data: DEMO_CONTRACTS });
}
