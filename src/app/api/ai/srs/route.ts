import { NextResponse } from "next/server";

import { supabaseAdmin, isSupabaseConfigured } from "@/lib/db/supabaseAdmin";
import { SrsSchema, srsJsonSchema, type SrsOutput } from "@/lib/ai/schemas/srs";
import { buildSrsPrompt, buildRefinementPrompt } from "@/lib/ai/prompts/srs";
import type { SrsPromptOptions } from "@/lib/ai/prompts/srs";
import { generateWithGeminiReliability } from "@/lib/ai/geminiReliability";
import { extractJsonObject } from "@/lib/ai/jsonUtils";

interface SrsRequest {
  clientRequest: string;
  projectId?: string;
  language?: SrsPromptOptions["language"];
  detailLevel?: SrsPromptOptions["detailLevel"];
  outputStyle?: SrsPromptOptions["outputStyle"];
  projectType?: string;
  enabledSections?: Record<string, boolean>;
  clientFacingMode?: boolean;
  currentSrs?: SrsOutput;
  refinementMessage?: string;
}

const CLINIC_FALLBACK: SrsOutput = {
  projectBrief: {
    projectName: "Clinic Booking Platform",
    clientName: null,
    industry: "Healthcare",
    complexity: "medium",
    summary:
      "A web-based appointment booking system for clinics that allows patients to book appointments online, enables administrators to manage doctors and schedules, and provides automated notifications and basic booking reports.",
  },
  userRoles: [
    {
      role: "Patient",
      description:
        "Books appointments online by selecting a clinic, doctor, date, and time. Receives booking confirmations and reminders.",
      permissions: [
        "view clinic and doctor listings",
        "book appointment",
        "cancel own appointment",
        "view appointment history",
        "receive notifications",
      ],
    },
    {
      role: "Admin / Receptionist",
      description:
        "Manages doctor schedules, oversees all bookings, handles cancellations, and generates basic reports.",
      permissions: [
        "manage doctors and specialties",
        "manage all appointments",
        "view all bookings",
        "generate reports",
        "send manual notifications",
        "block time slots",
      ],
    },
    {
      role: "Doctor",
      description: "Views their personal schedule and upcoming patient appointments.",
      permissions: ["view own schedule", "view appointment details"],
    },
  ],
  mainFeatures: [
    {
      title: "Patient Booking Website",
      description:
        "Public-facing site for patients to browse clinics, select a doctor, and book available appointment slots.",
      priority: "critical",
    },
    {
      title: "Admin Dashboard",
      description:
        "Management interface for controlling doctors, appointments, and clinic availability.",
      priority: "critical",
    },
    {
      title: "Appointment Management",
      description: "Full lifecycle management for appointments — create, reschedule, cancel, and confirm.",
      priority: "high",
    },
    {
      title: "Patient Notifications",
      description:
        "Automated booking confirmations and reminders sent to patients before appointments.",
      priority: "high",
    },
    {
      title: "Basic Reports",
      description:
        "Simple booking volume and appointment status summaries for management review.",
      priority: "medium",
    },
  ],
  functionalRequirements: [
    {
      id: "FR-01",
      title: "Online Appointment Booking",
      description:
        "Patients can select a clinic, doctor, available date and time slot, and confirm a booking.",
      priority: "critical",
    },
    {
      id: "FR-02",
      title: "Doctor Schedule Management",
      description:
        "Admins can define working hours, block unavailable slots, and assign doctors to clinics.",
      priority: "critical",
    },
    {
      id: "FR-03",
      title: "Booking Confirmation",
      description:
        "System sends a confirmation to the patient via email or SMS immediately after a successful booking.",
      priority: "high",
    },
    {
      id: "FR-04",
      title: "Appointment Reminders",
      description: "Automated reminder sent to the patient 24 hours before the scheduled appointment.",
      priority: "high",
    },
    {
      id: "FR-05",
      title: "Admin Appointment Control",
      description:
        "Admins can view, modify, cancel, or reschedule any appointment from the dashboard.",
      priority: "high",
    },
    {
      id: "FR-06",
      title: "Basic Reporting",
      description:
        "Admin can generate simple reports showing total bookings, cancellations, and per-doctor utilization.",
      priority: "medium",
    },
  ],
  nonFunctionalRequirements: [
    {
      category: "Performance",
      requirement: "Booking confirmation must complete within 3 seconds under normal load.",
    },
    {
      category: "Availability",
      requirement: "System should maintain 99% uptime during clinic operating hours.",
    },
    {
      category: "Security",
      requirement:
        "Patient data must be stored securely. No sensitive health records beyond appointment details.",
    },
    {
      category: "Usability",
      requirement:
        "Booking flow must be completable in under 3 steps on both desktop and mobile browsers.",
    },
  ],
  missingQuestions: [
    "How many clinics and doctors should the platform support at launch?",
    "Should patients be able to book without registering (guest booking)?",
    "Which notification channels are required: SMS, email, or both?",
    "Is payment for appointments required, or is booking free at this stage?",
    "What language(s) should the patient-facing site support (Arabic, English, or both)?",
    "Are there local health data compliance requirements that apply?",
  ],
  mvpScope: [
    "Patient booking website with clinic and doctor selection",
    "Admin dashboard for managing doctors, time slots, and appointments",
    "Email-based booking confirmation and appointment reminders",
    "Basic appointment report for admin (summary dashboard or CSV export)",
  ],
  assumptions: [
    "The platform targets small-to-medium clinics, not full hospital management systems.",
    "Patients will use the web interface; a mobile app is not in scope for MVP.",
    "Payment processing is out of scope for the initial release.",
    "The client will supply clinic and doctor seed data for initial setup.",
    "Arabic-English bilingual support will be addressed in a follow-up phase if needed.",
  ],
  confidenceScore: 72,
};

const GENERIC_FALLBACK: SrsOutput = {
  projectBrief: {
    projectName: "Custom Software Platform",
    clientName: null,
    industry: "Technology",
    complexity: "medium",
    summary:
      "A web-based software platform tailored to the client's operational needs, covering core data management, role-based access, automated workflows, and basic reporting for internal users.",
  },
  userRoles: [
    {
      role: "End User",
      description:
        "Primary user who interacts with the platform to complete daily tasks and manage their own records.",
      permissions: [
        "view records",
        "create entries",
        "edit own records",
        "receive notifications",
      ],
    },
    {
      role: "Administrator",
      description:
        "Manages platform configuration, user accounts, operational data, and reports.",
      permissions: [
        "manage users",
        "configure system settings",
        "view all records",
        "generate reports",
        "export data",
      ],
    },
  ],
  mainFeatures: [
    {
      title: "Core Data Management",
      description:
        "Create, view, update, and delete primary records relevant to the platform's domain.",
      priority: "critical",
    },
    {
      title: "User Roles and Access Control",
      description:
        "Role-based access so different users see only the data and actions relevant to them.",
      priority: "critical",
    },
    {
      title: "Notifications",
      description: "Automated alerts for key events and status changes within the platform.",
      priority: "high",
    },
    {
      title: "Basic Reporting",
      description:
        "Simple dashboards and exportable reports for operational visibility.",
      priority: "medium",
    },
  ],
  functionalRequirements: [
    {
      id: "FR-01",
      title: "Record Creation and Management",
      description:
        "Users can create, read, update, and delete records within their permission level.",
      priority: "critical",
    },
    {
      id: "FR-02",
      title: "Role-Based Access Control",
      description: "System enforces permissions based on each user's assigned role.",
      priority: "critical",
    },
    {
      id: "FR-03",
      title: "Automated Notifications",
      description:
        "Trigger email or in-app alerts when key status changes or deadlines occur.",
      priority: "high",
    },
    {
      id: "FR-04",
      title: "Search and Filtering",
      description: "Users can search and filter records by relevant fields and date ranges.",
      priority: "high",
    },
    {
      id: "FR-05",
      title: "Export and Reporting",
      description: "Admins can export records to CSV and view summary reports.",
      priority: "medium",
    },
  ],
  nonFunctionalRequirements: [
    {
      category: "Performance",
      requirement: "Pages and data queries must load within 2 seconds under typical usage.",
    },
    {
      category: "Security",
      requirement:
        "All data must be transmitted over HTTPS and sessions must expire after inactivity.",
    },
    {
      category: "Usability",
      requirement: "Core workflows must be completable by non-technical users without training.",
    },
    {
      category: "Scalability",
      requirement: "Architecture must support at least 500 concurrent users at launch.",
    },
  ],
  missingQuestions: [
    "What is the primary domain or industry focus of this platform?",
    "How many users are expected at launch?",
    "Are there existing systems this platform must integrate with?",
    "What is the target timeline and budget range?",
    "Is mobile access required, or desktop web only?",
    "Are there specific compliance or data residency requirements?",
  ],
  mvpScope: [
    "Core record management with role-based access for End User and Administrator",
    "Email notifications for key workflow events",
    "Basic admin dashboard with summary metrics",
    "User management (add, edit, deactivate accounts)",
  ],
  assumptions: [
    "The platform will be web-based and accessible via modern desktop browsers.",
    "A mobile app is not required for the initial release.",
    "Third-party integrations are out of scope for MVP.",
    "The client will provide sample data for initial testing and validation.",
  ],
  confidenceScore: 55,
};

const CLINIC_KEYWORDS = [
  "clinic", "booking", "appointment", "medical", "doctor", "patient",
  "schedule", "hospital", "healthcare", "health", "physician",
  "عيادة", "حجز", "موعد", "طبيب", "مريض", "صحة", "مستشفى",
];

/**
 * Choose and adapt a fallback SRS based on the input domain and requested language.
 * Avoids returning a static clinic SRS for unrelated Arabic inputs.
 */
function selectFallback(
  request: string,
  language: string = "english",
  _projectType: string = "web-app"
): SrsOutput {
  const lower = request.toLowerCase();
  const isClinic = CLINIC_KEYWORDS.some((kw) => lower.includes(kw));
  const base: SrsOutput = isClinic
    ? { ...CLINIC_FALLBACK, projectBrief: { ...CLINIC_FALLBACK.projectBrief } }
    : { ...GENERIC_FALLBACK, projectBrief: { ...GENERIC_FALLBACK.projectBrief } };

  if (language === "english") return base;

  // Adapt project name and summary for Arabic / bilingual output
  const nameEn = base.projectBrief.projectName;
  const nameAr = isClinic ? "منصة حجز العيادات" : "نظام برمجي مخصص";
  const summaryAr = isClinic
    ? "نظام حجز مواعيد إلكتروني للعيادات يتضمن موقع حجز للمرضى ولوحة تحكم للإدارة مع إشعارات تلقائية وتقارير بسيطة. (نموذج توضيحي — الذكاء الاصطناعي غير متاح حالياً)"
    : "منصة برمجية متكاملة تغطي إدارة البيانات الأساسية والأدوار والصلاحيات والإشعارات الآلية والتقارير الإدارية. (نموذج توضيحي — الذكاء الاصطناعي غير متاح حالياً)";

  base.projectBrief.projectName =
    language === "arabic" ? nameAr : `${nameEn} / ${nameAr}`;
  base.projectBrief.summary =
    language === "arabic"
      ? summaryAr
      : `${base.projectBrief.summary}\n\n[عربي] ${summaryAr}`;

  return base;
}

// ─── Qwen schema hint ─────────────────────────────────────────────────────────
// Compact description of the SRS JSON shape sent to Qwen's system message.
// Gemini uses responseSchema instead and ignores this.
const SRS_SCHEMA_HINT = `{
  "projectBrief": { "projectName": "string", "clientName": "string or null", "industry": "string", "complexity": "low|medium|high", "summary": "string" },
  "userRoles": [ { "role": "string", "description": "string", "permissions": ["string"] } ],
  "mainFeatures": [ { "title": "string", "description": "string", "priority": "critical|high|medium|low" } ],
  "functionalRequirements": [ { "id": "FR-01", "title": "string", "description": "string", "priority": "critical|high|medium|low" } ],
  "nonFunctionalRequirements": [ { "category": "string", "requirement": "string" } ],
  "missingQuestions": ["string"],
  "mvpScope": ["string"],
  "assumptions": ["string"],
  "confidenceScore": 75
}`;

// ─── SRS response normalization ───────────────────────────────────────────────
// Applied before Zod validation to handle common Qwen output quirks:
//  - Wrapper keys (srs/data/output/result) when the model nests the object
//  - snake_case top-level keys (project_brief → projectBrief, etc.)
//  - Missing nullable field clientName
//  - userRoles with no permissions array

const SRS_TOP_LEVEL_KEYS = new Set([
  "projectBrief", "project_brief",
  "userRoles", "user_roles",
  "mainFeatures", "main_features",
  "functionalRequirements", "functional_requirements",
  "nonFunctionalRequirements", "non_functional_requirements",
  "missingQuestions", "missing_questions",
  "mvpScope", "mvp_scope",
  "assumptions",
  "confidenceScore", "confidence_score",
]);

const SNAKE_TO_CAMEL: Record<string, string> = {
  project_brief: "projectBrief",
  user_roles: "userRoles",
  main_features: "mainFeatures",
  functional_requirements: "functionalRequirements",
  non_functional_requirements: "nonFunctionalRequirements",
  missing_questions: "missingQuestions",
  mvp_scope: "mvpScope",
  confidence_score: "confidenceScore",
};

function normalizeSrsResponse(raw: unknown): unknown {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;

  let data = raw as Record<string, unknown>;

  // Unwrap a wrapper key only when the nested object actually contains SRS fields
  for (const wrapKey of ["srs", "data", "output", "result"]) {
    const val = data[wrapKey];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const inner = val as Record<string, unknown>;
      if (Object.keys(inner).some((k) => SRS_TOP_LEVEL_KEYS.has(k))) {
        data = inner;
        break;
      }
    }
  }

  // Map snake_case → camelCase for any top-level keys that are absent in camelCase form
  const result: Record<string, unknown> = { ...data };
  for (const [snake, camel] of Object.entries(SNAKE_TO_CAMEL)) {
    if (snake in result && !(camel in result)) {
      result[camel] = result[snake];
      delete result[snake];
    }
  }

  // Ensure projectBrief.clientName exists (Zod schema requires it, even as null)
  if (result.projectBrief && typeof result.projectBrief === "object" && !Array.isArray(result.projectBrief)) {
    const brief = result.projectBrief as Record<string, unknown>;
    if (!("clientName" in brief)) brief.clientName = null;
  }

  // Ensure every userRole has a permissions array (Zod requires it)
  if (Array.isArray(result.userRoles)) {
    result.userRoles = (result.userRoles as unknown[]).map((role) => {
      if (!role || typeof role !== "object" || Array.isArray(role)) return role;
      const r = { ...(role as Record<string, unknown>) };
      if (!Array.isArray(r.permissions)) {
        r.permissions = r.permissions ? [String(r.permissions)] : [];
      }
      return r;
    });
  }

  // Normalize confidenceScore: Gemini sometimes returns a 0–1 fraction instead of 0–100 integer.
  // Any value ≤ 1.0 is treated as a fraction and scaled up.
  if (typeof result.confidenceScore === "number" && result.confidenceScore >= 0 && result.confidenceScore <= 1) {
    result.confidenceScore = Math.round(result.confidenceScore * 100);
  }

  return result;
}

export async function POST(req: Request) {
  try {
    const body: SrsRequest = await req.json();
    const {
      clientRequest,
      projectId,
      language = "english",
      detailLevel = "standard",
      outputStyle = "business",
      projectType = "web-app",
      enabledSections = {},
      clientFacingMode = false,
      currentSrs,
      refinementMessage,
    } = body;

    if (!clientRequest || clientRequest.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Client request is too short (min 10 characters)." },
        { status: 400 }
      );
    }

    const isRefinement = !!(refinementMessage && currentSrs);
    const prompt = isRefinement
      ? buildRefinementPrompt(currentSrs, refinementMessage)
      : buildSrsPrompt(clientRequest, {
          language,
          detailLevel,
          outputStyle,
          projectType,
          enabledSections,
          clientFacingMode,
        });

    let validated: SrsOutput;
    let usedFallback = false;
    let fallbackReason: string | null = null;
    let errorCode: number | null = null;
    let modelUsed: string | null = null;
    let attempts = 0;
    let retried = false;
    let providerUsed: "gemini" | "qwen" | "local_fallback" = "local_fallback";

    const aiResult = await generateWithGeminiReliability(
      prompt,
      { responseMimeType: "application/json", responseSchema: srsJsonSchema },
      { schemaHint: SRS_SCHEMA_HINT }
    );

    if (aiResult.ok) {
      providerUsed = aiResult.providerUsed;
      modelUsed = aiResult.modelUsed;
      attempts = aiResult.attempts;
      retried = aiResult.retried;
      // Qwen is a fallback provider — caller should know Gemini wasn't used
      if (aiResult.providerUsed === "qwen") usedFallback = true;
      try {
        const extracted = extractJsonObject(aiResult.text);
        const normalized = normalizeSrsResponse(extracted);
        validated = SrsSchema.parse(normalized);
      } catch (parseError) {
        // Log a raw preview server-side to diagnose Qwen output shape — never sent to client
        if (aiResult.providerUsed === "qwen") {
          console.warn("[SRS] Qwen raw response preview:", aiResult.text.slice(0, 800));
        }
        console.warn(`[SRS] Failed to parse/validate ${aiResult.providerUsed} response:`, parseError);
        validated = isRefinement
          ? (currentSrs as SrsOutput)
          : selectFallback(clientRequest, language, projectType);
        usedFallback = true;
        fallbackReason = "parse_error";
        providerUsed = "local_fallback";
      }
    } else {
      console.warn("[SRS] All AI providers failed — using local fallback SRS.", {
        attempts: aiResult.attempts,
        fallbackReason: aiResult.fallbackReason,
        errorCode: aiResult.errorCode,
      });
      validated = isRefinement
        ? (currentSrs as SrsOutput)
        : selectFallback(clientRequest, language, projectType);
      usedFallback = true;
      fallbackReason = aiResult.fallbackReason;
      errorCode = aiResult.errorCode;
      attempts = aiResult.attempts;
      retried = aiResult.retried;
      providerUsed = "local_fallback";
    }

    // Only persist when Supabase is fully configured — skip silently otherwise
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from("srs_documents").insert({
          project_id: projectId || "default-project",
          client_request: clientRequest,
          output_json: validated,
          confidence_score: validated.confidenceScore,
        });

        await supabaseAdmin.from("ai_outputs").insert({
          project_id: projectId || "default-project",
          type: "srs",
          json: validated,
        });
      } catch (dbError) {
        console.error("[SRS] Supabase persistence failed (non-blocking):", dbError);
      }
    } else {
      console.warn("[SRS] Supabase not configured — skipping persistence. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.");
    }

    if (usedFallback) {
      const isLocalFallback = providerUsed === "local_fallback";
      return NextResponse.json({
        success: true,
        providerUsed,
        source: isLocalFallback ? "fallback" : providerUsed,
        usedFallback: true,
        fallbackReason,
        errorCode,
        modelUsed,
        attempts,
        retried,
        warning: isLocalFallback
          ? "All AI providers unavailable — local fallback SRS loaded."
          : `Gemini unavailable — SRS generated by ${providerUsed}.`,
        data: validated,
      });
    }

    return NextResponse.json({
      success: true,
      providerUsed,
      source: providerUsed,
      usedFallback: false,
      fallbackReason: null,
      errorCode: null,
      modelUsed,
      attempts,
      retried,
      data: validated,
    });
  } catch (error) {
    console.error("SRS generation failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate SRS. Please try again." },
      { status: 500 }
    );
  }
}
