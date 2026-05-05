import type {
  BusinessUnderstandingOutput,
  BusinessAnalysisOutput,
  BusinessRulesOutput,
  TechnicalBlueprintOutput,
  ExecutionPlanOutput,
  FinalDecisionOutput,
  ProjectIntelligenceOutput,
  PipelineLanguage,
} from "@/lib/ai/schemas/projectIntelligence";

// ─── Demo scenario constants ─────────────────────────────────────────────────
// Used when Gemini + Qwen are both unavailable so the bootcamp / portfolio demo
// (NexaSoft building a clinic booking platform for Al Waha Clinics) still
// produces a coherent end-to-end output for every stage.

const PROJECT_NAME_EN = "Clinic Booking Platform";
const PROJECT_NAME_AR = "منصة حجز العيادات";
const CLIENT_NAME = "Al Waha Clinics";

// ─── Bilingual helper ────────────────────────────────────────────────────────

function pickString(en: string, ar: string, language: PipelineLanguage): string {
  if (language === "english") return en;
  if (language === "arabic") return ar;
  return `${en} / ${ar}`;
}

function pickList(
  en: string[],
  ar: string[],
  language: PipelineLanguage
): string[] {
  if (language === "english") return en;
  if (language === "arabic") return ar;
  return en.map((item, i) => `${item} / ${ar[i] ?? item}`);
}

// ─── Stage 1: Business Understanding ─────────────────────────────────────────

export function fallbackBusinessUnderstanding(
  language: PipelineLanguage = "english"
): BusinessUnderstandingOutput {
  return {
    problem: pickString(
      "Al Waha Clinics has no centralised digital booking flow, so patients call reception during business hours and receptionists manually juggle doctor schedules across branches.",
      "لا توجد لدى عيادات الواحة قناة حجز رقمية موحدة، مما يضطر المرضى للاتصال خلال ساعات العمل ويزيد العبء على موظفي الاستقبال في إدارة جداول الأطباء عبر الفروع.",
      language
    ),
    targetUsers: pickList(
      [
        "Patients booking appointments online",
        "Clinic receptionists / administrators",
        "Doctors viewing their daily schedules",
        "Clinic management reviewing booking performance",
      ],
      [
        "المرضى الذين يحجزون المواعيد إلكترونياً",
        "موظفو الاستقبال والإدارة في العيادة",
        "الأطباء الذين يراجعون جداولهم اليومية",
        "إدارة العيادة التي تتابع أداء الحجوزات",
      ],
      language
    ),
    businessGoal: pickString(
      "Reduce no-show rates and reception load while increasing booked appointment volume by enabling 24/7 self-service booking and automated reminders.",
      "تقليل نسب عدم الحضور والعبء على موظفي الاستقبال مع زيادة حجم الحجوزات عبر الحجز الذاتي على مدار الساعة وتذكيرات تلقائية.",
      language
    ),
    valueProposition: pickString(
      "Patients get instant booking confirmation in their preferred language, while clinic staff regain hours every day previously spent on phone scheduling.",
      "يحصل المرضى على تأكيد فوري للحجز بلغتهم المفضلة، وتسترجع العيادة ساعات يومية كانت تُنفق على الحجز عبر الهاتف.",
      language
    ),
    coreUseCases: pickList(
      [
        "A patient browses available doctors and books a slot from their phone in under three steps.",
        "A receptionist views the day's bookings, blocks emergency slots, and reschedules a patient on behalf of a doctor.",
        "A doctor opens a personalised view of today's schedule with patient context.",
        "A clinic manager exports a weekly report of bookings, cancellations, and no-shows per branch.",
        "A patient receives an automated reminder 24 hours and 1 hour before their appointment.",
      ],
      [
        "يتصفح المريض الأطباء المتاحين ويحجز موعداً من هاتفه في أقل من ثلاث خطوات.",
        "يطلع موظف الاستقبال على حجوزات اليوم، ويحجب فترات للطوارئ، ويعيد جدولة المريض نيابة عن الطبيب.",
        "يفتح الطبيب شاشة مخصصة بجدوله اليومي مع معلومات المريض.",
        "تصدّر إدارة العيادة تقريراً أسبوعياً لحجوزات وإلغاءات وعدم حضور كل فرع.",
        "يتلقى المريض تذكيراً تلقائياً قبل 24 ساعة وقبل ساعة من الموعد.",
      ],
      language
    ),
    assumptions: pickList(
      [
        "Patients have smartphones with internet access.",
        "Clinics will provide doctor availability data and consent flows.",
        "MVP targets 3–5 branches initially with room to scale.",
        "Phone-based booking remains as a fallback during transition.",
      ],
      [
        "يمتلك المرضى هواتف ذكية متصلة بالإنترنت.",
        "ستوفّر العيادات بيانات توفر الأطباء وسياسات الموافقة.",
        "تستهدف النسخة الأولى 3 إلى 5 فروع مع قابلية للتوسع.",
        "يبقى الحجز الهاتفي خياراً احتياطياً خلال مرحلة الانتقال.",
      ],
      language
    ),
    missingInformation: pickList(
      [
        "Total number of clinics, doctors, and expected booking volume per month.",
        "Whether payment / deposit collection is in scope for MVP.",
        "Compliance requirements (Saudi PDPL, ZATCA invoicing if payments are added).",
        "Existing systems the platform must integrate with (EMR, SMS gateway).",
        "Required notification channels (SMS, email, WhatsApp).",
      ],
      [
        "العدد الإجمالي للعيادات والأطباء وحجم الحجوزات الشهري المتوقع.",
        "هل تحصيل المدفوعات أو العربون ضمن نطاق النسخة الأولى؟",
        "متطلبات الامتثال (نظام حماية البيانات السعودي، فوترة زاتكا عند إضافة المدفوعات).",
        "الأنظمة الحالية التي يجب التكامل معها (السجل الطبي، مزود الرسائل القصيرة).",
        "قنوات الإشعار المطلوبة (رسائل قصيرة، بريد، واتساب).",
      ],
      language
    ),
    confidenceScore: 70,
  };
}

// ─── Stage 2: Business Analysis ──────────────────────────────────────────────

export function fallbackBusinessAnalysis(
  language: PipelineLanguage = "english"
): BusinessAnalysisOutput {
  return {
    revenuePotential: "medium",
    estimatedRevenueRange: pickString(
      "Approx. USD 30k–80k recurring annual revenue within 12 months, assuming 100–250 paying clinics on a SaaS subscription model — figures are rough estimates that depend on confirmed pricing and clinic uptake.",
      "نحو 30 إلى 80 ألف دولار سنوياً متكرراً خلال 12 شهراً، بافتراض 100 إلى 250 عيادة مشتركة وفق نموذج SaaS — الأرقام تقديرية وتعتمد على التسعير المعتمد وسرعة تبني العيادات.",
      language
    ),
    costLevel: "medium",
    costBreakdown: [
      {
        category: pickString("Engineering build-out", "بناء النظام البرمجي", language),
        estimate: pickString(
          "USD 25k–45k for MVP across 10–14 weeks",
          "25 إلى 45 ألف دولار لإطلاق النسخة الأولى خلال 10 إلى 14 أسبوعاً",
          language
        ),
        notes: pickString(
          "Assumes 2–3 senior engineers and a part-time designer.",
          "بافتراض 2 إلى 3 مهندسين أقدمين ومصمم بدوام جزئي.",
          language
        ),
      },
      {
        category: pickString("Cloud + infrastructure", "البنية السحابية", language),
        estimate: pickString(
          "USD 200–600 / month at MVP scale",
          "200 إلى 600 دولار شهرياً عند حجم النسخة الأولى",
          language
        ),
        notes: pickString(
          "Supabase + Vercel; scales with clinic count.",
          "Supabase وVercel؛ تزيد التكاليف مع عدد العيادات.",
          language
        ),
      },
      {
        category: pickString("Notifications (SMS / email)", "الإشعارات", language),
        estimate: pickString(
          "USD 0.02–0.05 per SMS, USD ~0.001 per email",
          "0.02 إلى 0.05 دولار لكل رسالة قصيرة، نحو 0.001 دولار لكل بريد",
          language
        ),
        notes: pickString(
          "Local Saudi SMS gateways pricing varies.",
          "تتفاوت أسعار مزودي الرسائل القصيرة المحليين.",
          language
        ),
      },
      {
        category: pickString("Support & onboarding", "الدعم والتأهيل", language),
        estimate: pickString(
          "USD 1.5k–3k / month with one part-time success engineer",
          "1.5 إلى 3 آلاف دولار شهرياً بمهندس نجاح بدوام جزئي",
          language
        ),
        notes: null,
      },
      {
        category: pickString("Compliance review", "مراجعة الامتثال", language),
        estimate: pickString(
          "USD 2k–5k one-off legal review",
          "ألفان إلى خمسة آلاف دولار لمراجعة قانونية لمرة واحدة",
          language
        ),
        notes: pickString(
          "Saudi PDPL alignment when handling patient data.",
          "للتوافق مع نظام حماية البيانات الشخصية عند التعامل مع بيانات المرضى.",
          language
        ),
      },
    ],
    roiAssessment: "medium",
    marketMaturity: "growing",
    keyRisks: pickList(
      [
        "Local competitors may already serve large hospital chains.",
        "Clinics are price-sensitive — premium pricing risks slow adoption.",
        "Reliance on a single SMS provider creates a delivery bottleneck.",
        "Data residency expectations may require Saudi-region hosting.",
      ],
      [
        "قد تكون هناك حلول محلية تخدم سلاسل المستشفيات الكبيرة بالفعل.",
        "العيادات حساسة للسعر، والتسعير المرتفع قد يبطئ التبني.",
        "الاعتماد على مزود رسائل واحد يخلق عنق زجاجة في التسليم.",
        "متطلبات إقامة البيانات قد تستوجب استضافة داخل المملكة.",
      ],
      language
    ),
    opportunities: pickList(
      [
        "Cross-sell to dental, physiotherapy, and aesthetic clinics with the same model.",
        "Add a paid analytics tier with no-show predictions and revenue forecasting.",
        "Bundle with electronic prescription services for higher ACV.",
        "Whitelabel the booking flow for clinic chains under their brand.",
      ],
      [
        "البيع المتقاطع لعيادات الأسنان والعلاج الطبيعي والتجميل بالنموذج نفسه.",
        "إضافة طبقة تحليلات مدفوعة مع توقع عدم الحضور وتوقعات الإيرادات.",
        "الدمج مع خدمات الوصفات الإلكترونية لزيادة قيمة العقد السنوي.",
        "نسخة بعلامة العميل لسلاسل العيادات.",
      ],
      language
    ),
    recommendation: "needs_validation",
    reasoning: pickString(
      "The opportunity has a credible path to medium ROI, but pricing assumptions, target clinic count, and integration scope are unconfirmed. A short paid pilot with one clinic would validate the model before committing to full build.",
      "الفرصة تمتلك مساراً منطقياً لعائد متوسط، لكن افتراضات التسعير وعدد العيادات المستهدف ونطاق التكاملات لم تُثبت. تجربة مدفوعة قصيرة مع عيادة واحدة قبل الالتزام ببناء كامل ستؤكد النموذج.",
      language
    ),
    confidenceScore: 65,
  };
}

// ─── Stage 3: Business Rules ─────────────────────────────────────────────────

export function fallbackBusinessRules(
  language: PipelineLanguage = "english"
): BusinessRulesOutput {
  return {
    businessRules: [
      {
        id: "BR-01",
        rule: pickString(
          "A time slot held by one patient cannot be booked by another for 5 minutes after selection.",
          "لا يمكن لأي مريض حجز موعد محتجز من قِبل مريض آخر خلال 5 دقائق من الاختيار.",
          language
        ),
        rationale: pickString(
          "Prevents double-bookings during checkout latency.",
          "يمنع الحجز المزدوج أثناء فترة إكمال الحجز.",
          language
        ),
        priority: "critical",
      },
      {
        id: "BR-02",
        rule: pickString(
          "Patients can cancel a booking up to 4 hours before its start time without penalty.",
          "يمكن للمريض إلغاء الحجز قبل موعده بأربع ساعات على الأقل دون أي رسوم.",
          language
        ),
        rationale: pickString(
          "Aligns with clinic workflow expectations and reduces no-show losses.",
          "يتماشى مع سير العمل ويقلّل خسائر عدم الحضور.",
          language
        ),
        priority: "high",
      },
      {
        id: "BR-03",
        rule: pickString(
          "Doctors' personal phone numbers must never be exposed to patients.",
          "يجب ألا تُكشف أرقام هواتف الأطباء الشخصية للمرضى أبداً.",
          language
        ),
        rationale: pickString(
          "Protects doctor privacy and aligns with clinic policy.",
          "حماية خصوصية الطبيب والتوافق مع سياسة العيادة.",
          language
        ),
        priority: "high",
      },
      {
        id: "BR-04",
        rule: pickString(
          "Reminder notifications are sent 24 hours and 1 hour before each appointment.",
          "ترسل الإشعارات قبل 24 ساعة وقبل ساعة من كل موعد.",
          language
        ),
        rationale: pickString(
          "Reduces no-show rate without spamming patients.",
          "يقلّل عدم الحضور دون إزعاج المريض.",
          language
        ),
        priority: "high",
      },
      {
        id: "BR-05",
        rule: pickString(
          "Admins can override any booking, but the override must be logged with the admin's user id and timestamp.",
          "يمكن للمسؤولين تجاوز أي حجز، مع تسجيل المعرّف والوقت لكل عملية تجاوز.",
          language
        ),
        rationale: pickString(
          "Auditability for clinic management and dispute resolution.",
          "قابلية التدقيق لأغراض الإدارة وتسوية النزاعات.",
          language
        ),
        priority: "medium",
      },
    ],
    constraints: pickList(
      [
        "All patient data must be stored in a Saudi-region or compliant data centre.",
        "Booking flow must be completable in three steps on mobile.",
        "UI must support Arabic (RTL) and English with parity.",
        "Confirmation latency must not exceed 3 seconds at booking submission.",
      ],
      [
        "تُخزَّن بيانات المرضى في مركز بيانات داخل المملكة أو مركز متوافق.",
        "يجب أن يكتمل الحجز في ثلاث خطوات على الجوال.",
        "تدعم الواجهة العربية (من اليمين إلى اليسار) والإنجليزية بالتساوي.",
        "زمن تأكيد الحجز لا يتجاوز ثلاث ثوانٍ.",
      ],
      language
    ),
    workflows: [
      {
        name: pickString("Patient self-booking", "حجز ذاتي للمريض", language),
        steps: pickList(
          [
            "Patient selects clinic and doctor.",
            "Patient picks an available time slot.",
            "Patient confirms identity and contact details.",
            "System sends confirmation by email/SMS.",
            "System schedules reminders.",
          ],
          [
            "يختار المريض العيادة والطبيب.",
            "يختار المريض فترة متاحة.",
            "يؤكد المريض هويته وبيانات التواصل.",
            "يرسل النظام التأكيد عبر البريد أو الرسالة القصيرة.",
            "يجدول النظام التذكيرات.",
          ],
          language
        ),
      },
      {
        name: pickString("Reception override", "تجاوز موظف الاستقبال", language),
        steps: pickList(
          [
            "Receptionist looks up the booking.",
            "Receptionist edits, reschedules, or cancels with reason.",
            "System logs override action with user id and timestamp.",
            "Patient receives an updated notification.",
          ],
          [
            "يبحث موظف الاستقبال عن الحجز.",
            "يعدّل الحجز أو يعيد جدولته أو يلغيه مع ذكر السبب.",
            "يسجّل النظام عملية التجاوز بالمعرّف والوقت.",
            "يتلقى المريض إشعاراً محدّثاً.",
          ],
          language
        ),
      },
    ],
    rolesInteractions: [
      {
        role: pickString("Patient", "المريض", language),
        interactsWith: pickList(
          ["Booking website", "Notification system"],
          ["موقع الحجز", "نظام الإشعارات"],
          language
        ),
        description: pickString(
          "Self-serves bookings, cancellations, and reschedules within policy.",
          "يحجز ويلغي ويعيد الجدولة ضمن السياسة المعتمدة.",
          language
        ),
      },
      {
        role: pickString("Receptionist", "موظف الاستقبال", language),
        interactsWith: pickList(
          ["Admin dashboard", "Patients", "Doctors"],
          ["لوحة الإدارة", "المرضى", "الأطباء"],
          language
        ),
        description: pickString(
          "Manages exceptions, manual bookings, and same-day adjustments.",
          "يدير الاستثناءات والحجوزات اليدوية والتعديلات اليومية.",
          language
        ),
      },
      {
        role: pickString("Doctor", "الطبيب", language),
        interactsWith: pickList(
          ["Doctor schedule view"],
          ["شاشة جدول الطبيب"],
          language
        ),
        description: pickString(
          "Views read-only daily schedule and patient summaries.",
          "يطلع على جدول اليوم وملخصات المرضى للقراءة فقط.",
          language
        ),
      },
      {
        role: pickString("Clinic manager", "مدير العيادة", language),
        interactsWith: pickList(
          ["Reports", "Admin dashboard"],
          ["التقارير", "لوحة الإدارة"],
          language
        ),
        description: pickString(
          "Reviews KPIs and exports periodic reports.",
          "يراجع المؤشرات ويُصدّر تقارير دورية.",
          language
        ),
      },
    ],
    policyDecisions: pickList(
      [
        "Will deposits or no-show fees be charged?",
        "Should patients be allowed to book without registering an account?",
        "What is the official audit log retention period?",
        "What is the escalation path when a clinic disputes a booking?",
      ],
      [
        "هل ستُفرض دفعات مقدّمة أو رسوم عدم حضور؟",
        "هل يُسمح للمرضى بالحجز دون إنشاء حساب؟",
        "ما المدة الرسمية للاحتفاظ بسجل التدقيق؟",
        "ما مسار التصعيد عند اعتراض عيادة على حجز؟",
      ],
      language
    ),
    confidenceScore: 70,
  };
}

// ─── Stage 4: Technical Blueprint ────────────────────────────────────────────

export function fallbackTechnicalBlueprint(
  language: PipelineLanguage = "english"
): TechnicalBlueprintOutput {
  const projectName =
    language === "english"
      ? PROJECT_NAME_EN
      : language === "arabic"
        ? PROJECT_NAME_AR
        : `${PROJECT_NAME_EN} / ${PROJECT_NAME_AR}`;

  return {
    projectBrief: {
      projectName,
      clientName: CLIENT_NAME,
      industry: pickString("Healthcare", "الرعاية الصحية", language),
      complexity: "medium",
      summary: pickString(
        "A web-based appointment booking platform that lets patients book online, gives admins a dashboard to manage doctors and schedules, and sends automated reminders.",
        "منصة حجز مواعيد إلكترونية تمكّن المرضى من الحجز، وتمنح الإدارة لوحة تحكم لإدارة الأطباء والجداول، وترسل تذكيرات تلقائية.",
        language
      ),
    },
    userRoles: [
      {
        role: pickString("Patient", "المريض", language),
        description: pickString(
          "Books, reschedules, and cancels appointments online.",
          "يحجز ويعيد الجدولة ويلغي المواعيد إلكترونياً.",
          language
        ),
        permissions: pickList(
          [
            "view clinics and doctors",
            "book appointment",
            "cancel own appointment",
            "view appointment history",
          ],
          [
            "عرض العيادات والأطباء",
            "حجز موعد",
            "إلغاء موعده",
            "عرض سجل المواعيد",
          ],
          language
        ),
      },
      {
        role: pickString("Admin / Receptionist", "المسؤول / موظف الاستقبال", language),
        description: pickString(
          "Manages doctor schedules, oversees bookings, and handles exceptions.",
          "يدير جداول الأطباء ويشرف على الحجوزات ويعالج الاستثناءات.",
          language
        ),
        permissions: pickList(
          [
            "manage doctors and clinics",
            "manage all appointments",
            "block time slots",
            "send manual notifications",
            "generate reports",
          ],
          [
            "إدارة الأطباء والعيادات",
            "إدارة جميع الحجوزات",
            "حجز فترات للطوارئ",
            "إرسال إشعارات يدوية",
            "توليد التقارير",
          ],
          language
        ),
      },
      {
        role: pickString("Doctor", "الطبيب", language),
        description: pickString(
          "Reads their own schedule and upcoming appointments.",
          "يطلع على جدوله ومواعيده القادمة.",
          language
        ),
        permissions: pickList(
          ["view own schedule", "view appointment details"],
          ["عرض جدوله", "عرض تفاصيل الموعد"],
          language
        ),
      },
    ],
    mainFeatures: [
      {
        title: pickString("Patient Booking Website", "موقع حجز المرضى", language),
        description: pickString(
          "Public site for browsing clinics and doctors and booking available slots.",
          "موقع عام لتصفح العيادات والأطباء وحجز الفترات المتاحة.",
          language
        ),
        priority: "critical",
      },
      {
        title: pickString("Admin Dashboard", "لوحة تحكم الإدارة", language),
        description: pickString(
          "Operational dashboard to manage doctors, slots, and bookings.",
          "لوحة تشغيل لإدارة الأطباء والفترات والحجوزات.",
          language
        ),
        priority: "critical",
      },
      {
        title: pickString("Automated Notifications", "الإشعارات التلقائية", language),
        description: pickString(
          "Email and SMS confirmations and reminders before appointments.",
          "تأكيدات وتذكيرات عبر البريد والرسائل القصيرة قبل المواعيد.",
          language
        ),
        priority: "high",
      },
      {
        title: pickString("Doctor Schedule View", "شاشة جدول الطبيب", language),
        description: pickString(
          "Read-only schedule view for each doctor.",
          "شاشة قراءة فقط لجدول كل طبيب.",
          language
        ),
        priority: "medium",
      },
      {
        title: pickString("Basic Reports", "تقارير أساسية", language),
        description: pickString(
          "Booking volume, cancellations, and no-show summaries for management.",
          "ملخصات الحجوزات والإلغاءات وعدم الحضور للإدارة.",
          language
        ),
        priority: "medium",
      },
    ],
    functionalRequirements: [
      {
        id: "FR-01",
        title: pickString("Online Appointment Booking", "حجز المواعيد إلكترونياً", language),
        description: pickString(
          "Patients can pick a clinic, doctor, date, and time slot, then confirm a booking.",
          "يختار المريض العيادة والطبيب والتاريخ والوقت ثم يؤكد الحجز.",
          language
        ),
        priority: "critical",
      },
      {
        id: "FR-02",
        title: pickString("Doctor Schedule Management", "إدارة جداول الأطباء", language),
        description: pickString(
          "Admins define working hours, block slots, and assign doctors to clinics.",
          "يحدد المسؤولون ساعات العمل ويحجزون الفترات ويربطون الأطباء بالعيادات.",
          language
        ),
        priority: "critical",
      },
      {
        id: "FR-03",
        title: pickString("Booking Confirmation", "تأكيد الحجز", language),
        description: pickString(
          "System sends an immediate confirmation by email and/or SMS after a successful booking.",
          "يرسل النظام تأكيداً فورياً عبر البريد أو الرسائل القصيرة بعد إتمام الحجز.",
          language
        ),
        priority: "high",
      },
      {
        id: "FR-04",
        title: pickString("Appointment Reminders", "تذكيرات المواعيد", language),
        description: pickString(
          "Automated reminders sent 24 hours and 1 hour before the appointment.",
          "تذكيرات تلقائية قبل 24 ساعة وقبل ساعة من الموعد.",
          language
        ),
        priority: "high",
      },
      {
        id: "FR-05",
        title: pickString("Admin Override", "تجاوز المسؤول", language),
        description: pickString(
          "Admins can edit, reschedule, or cancel any appointment with audit logging.",
          "يستطيع المسؤول تعديل أي موعد أو إعادة جدولته أو إلغائه مع تسجيل العملية.",
          language
        ),
        priority: "high",
      },
      {
        id: "FR-06",
        title: pickString("Basic Reporting", "التقارير الأساسية", language),
        description: pickString(
          "Admins can generate reports for bookings, cancellations, and per-doctor utilisation.",
          "يستطيع المسؤول توليد تقارير الحجوزات والإلغاءات وأداء كل طبيب.",
          language
        ),
        priority: "medium",
      },
    ],
    nonFunctionalRequirements: [
      {
        category: pickString("Performance", "الأداء", language),
        requirement: pickString(
          "Booking confirmation must complete within 3 seconds under normal load.",
          "يجب أن يكتمل تأكيد الحجز خلال 3 ثوانٍ تحت الحمل الطبيعي.",
          language
        ),
      },
      {
        category: pickString("Availability", "التوفر", language),
        requirement: pickString(
          "99% uptime during clinic operating hours.",
          "توفر بنسبة 99% خلال ساعات عمل العيادة.",
          language
        ),
      },
      {
        category: pickString("Security", "الأمان", language),
        requirement: pickString(
          "Patient data is encrypted in transit and at rest; sessions expire after inactivity.",
          "تُشفَّر بيانات المريض أثناء النقل والتخزين، وتنتهي الجلسة عند الخمول.",
          language
        ),
      },
      {
        category: pickString("Localization", "التوطين", language),
        requirement: pickString(
          "Full Arabic (RTL) and English UI parity across patient and admin surfaces.",
          "دعم كامل للعربية والإنجليزية بالتساوي في واجهات المرضى والإدارة.",
          language
        ),
      },
    ],
    assumptions: pickList(
      [
        "Cloud-hosted on Supabase + Vercel.",
        "Authentication via email/SMS OTP, not full federated identity.",
        "No payment processing in MVP.",
        "Mobile app is out of scope for MVP — responsive web only.",
      ],
      [
        "الاستضافة على Supabase وVercel.",
        "المصادقة برمز لمرة واحدة عبر البريد أو الرسائل القصيرة بدون هويات موحدة.",
        "لا يوجد معالجة مدفوعات في النسخة الأولى.",
        "تطبيق الجوال خارج نطاق النسخة الأولى — فقط ويب متجاوب.",
      ],
      language
    ),
    mvpScope: pickList(
      [
        "Patient booking flow with clinic and doctor selection",
        "Admin dashboard with schedule and booking management",
        "Email + SMS confirmations and reminders",
        "Basic reporting export (CSV)",
      ],
      [
        "تدفق حجز المريض مع اختيار العيادة والطبيب",
        "لوحة إدارة بإدارة الجداول والحجوزات",
        "تأكيدات وتذكيرات عبر البريد والرسائل القصيرة",
        "تصدير تقارير أساسية بصيغة CSV",
      ],
      language
    ),
    missingQuestions: pickList(
      [
        "What SMS gateway will be used and is it Saudi-compliant?",
        "Are there existing clinic-management systems that must be integrated?",
        "What patient identifier is canonical — phone number, national ID, or both?",
        "Is multi-branch reporting required from day one?",
      ],
      [
        "ما مزود الرسائل القصيرة المستخدم وهل هو متوافق مع المتطلبات السعودية؟",
        "هل توجد أنظمة إدارة عيادات قائمة يجب التكامل معها؟",
        "ما المعرّف الرئيسي للمريض: رقم الجوال أم الهوية الوطنية أم كلاهما؟",
        "هل يُطلب توليد تقارير لعدة فروع منذ اليوم الأول؟",
      ],
      language
    ),
    confidenceScore: 72,
  };
}

// ─── Stage 5: Execution Plan ─────────────────────────────────────────────────

export function fallbackExecutionPlan(
  language: PipelineLanguage = "english"
): ExecutionPlanOutput {
  return {
    estimatedTimeline: pickString(
      "10–14 weeks for MVP delivery, with an additional 2–4 week stabilisation buffer before commercial rollout.",
      "10 إلى 14 أسبوعاً لإطلاق النسخة الأولى، مع 2 إلى 4 أسابيع إضافية للاستقرار قبل الإطلاق التجاري.",
      language
    ),
    complexity: "medium",
    teamRolesNeeded: [
      {
        role: pickString("Tech Lead / Senior Full-stack Engineer", "قائد تقني / مهندس Full-stack أقدم", language),
        count: 1,
        responsibilities: pickString(
          "Owns architecture, code reviews, and integrations.",
          "يقود البنية المعمارية ومراجعة الكود والتكاملات.",
          language
        ),
      },
      {
        role: pickString("Full-stack Engineer", "مهندس Full-stack", language),
        count: 2,
        responsibilities: pickString(
          "Builds patient booking flow and admin dashboard.",
          "يبني تدفق حجز المريض ولوحة الإدارة.",
          language
        ),
      },
      {
        role: pickString("Product Designer", "مصمم منتج", language),
        count: 1,
        responsibilities: pickString(
          "Designs RTL/LTR flows, builds the mobile-first UI kit.",
          "يصمم تدفقات RTL وLTR ويبني نظام الواجهات للجوال.",
          language
        ),
      },
      {
        role: pickString("QA Engineer", "مهندس اختبار", language),
        count: 1,
        responsibilities: pickString(
          "Owns test plan, regression suite, and pre-launch verification.",
          "يضع خطة الاختبار وحزمة الانحدار والتحقق قبل الإطلاق.",
          language
        ),
      },
      {
        role: pickString("Project Manager", "مدير مشروع", language),
        count: 1,
        responsibilities: pickString(
          "Coordinates the team and manages client communication.",
          "ينسّق الفريق ويدير التواصل مع العميل.",
          language
        ),
      },
    ],
    keyTasks: [
      {
        title: pickString("Authentication & user model", "المصادقة ونموذج المستخدم", language),
        description: pickString(
          "Email/SMS OTP login, role-based access (patient, admin, doctor).",
          "تسجيل دخول برمز لمرة واحدة وصلاحيات حسب الدور (مريض، مسؤول، طبيب).",
          language
        ),
        effort: pickString("1–2 weeks", "أسبوع إلى أسبوعين", language),
      },
      {
        title: pickString("Booking flow + slot locking", "تدفق الحجز وحجز الفترات", language),
        description: pickString(
          "Slot selection, hold timer, confirmation, and audit log.",
          "اختيار الفترة وعدّاد الحجز والتأكيد وسجل التدقيق.",
          language
        ),
        effort: pickString("2–3 weeks", "أسبوعان إلى ثلاثة أسابيع", language),
      },
      {
        title: pickString("Admin dashboard", "لوحة الإدارة", language),
        description: pickString(
          "Manage doctors, schedules, exceptions, and overrides.",
          "إدارة الأطباء والجداول والاستثناءات والتجاوزات.",
          language
        ),
        effort: pickString("2–3 weeks", "أسبوعان إلى ثلاثة أسابيع", language),
      },
      {
        title: pickString("Notifications service", "خدمة الإشعارات", language),
        description: pickString(
          "Confirmation + reminder pipeline with retry and provider abstraction.",
          "خط تأكيد وتذكير مع إعادة المحاولة وتجريد المزود.",
          language
        ),
        effort: pickString("1–2 weeks", "أسبوع إلى أسبوعين", language),
      },
      {
        title: pickString("Reporting & exports", "التقارير والتصدير", language),
        description: pickString(
          "Bookings, cancellations, and per-doctor utilisation reports with CSV export.",
          "تقارير الحجوزات والإلغاءات وأداء كل طبيب مع تصدير CSV.",
          language
        ),
        effort: pickString("1 week", "أسبوع واحد", language),
      },
      {
        title: pickString("Hardening & launch readiness", "التهيئة للإطلاق", language),
        description: pickString(
          "Load testing, security review, observability, on-call setup.",
          "اختبار الحمل ومراجعة الأمان والمراقبة وجاهزية الدعم.",
          language
        ),
        effort: pickString("2 weeks", "أسبوعان", language),
      },
    ],
    milestones: [
      {
        name: pickString("M1 — Auth & data model", "م١ — المصادقة ونموذج البيانات", language),
        timeline: pickString("Weeks 1–2", "الأسبوعان 1 و2", language),
        deliverables: pickList(
          ["Login flow", "Role-based access", "Schema + migrations"],
          ["تدفق تسجيل الدخول", "الصلاحيات حسب الدور", "المخططات والترحيلات"],
          language
        ),
      },
      {
        name: pickString("M2 — Patient booking", "م٢ — حجز المريض", language),
        timeline: pickString("Weeks 3–5", "الأسابيع 3 إلى 5", language),
        deliverables: pickList(
          ["Booking flow", "Slot locking", "Confirmation email/SMS"],
          ["تدفق الحجز", "حجز الفترة", "تأكيد عبر البريد أو الرسائل القصيرة"],
          language
        ),
      },
      {
        name: pickString("M3 — Admin dashboard", "م٣ — لوحة الإدارة", language),
        timeline: pickString("Weeks 6–8", "الأسابيع 6 إلى 8", language),
        deliverables: pickList(
          ["Schedule management", "Override workflow", "Audit log"],
          ["إدارة الجداول", "تدفق التجاوز", "سجل التدقيق"],
          language
        ),
      },
      {
        name: pickString("M4 — Reminders & reporting", "م٤ — التذكيرات والتقارير", language),
        timeline: pickString("Weeks 9–11", "الأسابيع 9 إلى 11", language),
        deliverables: pickList(
          ["Reminder pipeline", "Reports + CSV export"],
          ["خط التذكيرات", "التقارير وتصدير CSV"],
          language
        ),
      },
      {
        name: pickString("M5 — Pilot launch", "م٥ — الإطلاق التجريبي", language),
        timeline: pickString("Weeks 12–14", "الأسابيع 12 إلى 14", language),
        deliverables: pickList(
          ["Stabilisation", "Observability", "Pilot clinic onboarding"],
          ["الاستقرار", "المراقبة", "تأهيل العيادة التجريبية"],
          language
        ),
      },
    ],
    risksInExecution: pickList(
      [
        "SMS provider integration delays could slip notifications by 1–2 weeks.",
        "RTL parity across the admin dashboard is often underestimated.",
        "Slot-locking edge cases under concurrent load require careful testing.",
        "Late discovery of EMR integration scope can compress the timeline.",
      ],
      [
        "تأخر دمج مزود الرسائل القصيرة قد يؤجل الإشعارات أسبوعاً أو اثنين.",
        "تكافؤ واجهة RTL في لوحة الإدارة كثيراً ما يُقدَّر بأقل من اللازم.",
        "الحالات الحدية لقفل الفترات تحت الحمل تحتاج اختباراً دقيقاً.",
        "اكتشاف نطاق تكامل السجل الطبي متأخراً قد يضغط الجدول الزمني.",
      ],
      language
    ),
    confidenceScore: 68,
  };
}

// ─── Stage 6: Final Decision ─────────────────────────────────────────────────

export function fallbackFinalDecision(
  language: PipelineLanguage = "english"
): FinalDecisionOutput {
  return {
    finalDecision: "conditional",
    confidenceScore: 70,
    mainReason: pickString(
      "The opportunity is credible and the build is well-scoped, but pricing and pilot uptake assumptions need real-world validation before committing to full delivery.",
      "الفرصة منطقية والبناء واضح النطاق، إلا أن افتراضات التسعير ومدى تبني العيادات تحتاج إلى تحقق ميداني قبل الالتزام بالإطلاق الكامل.",
      language
    ),
    keyRisk: pickString(
      "Slow clinic adoption at the proposed price would push payback past 18 months.",
      "تأخر تبني العيادات عند السعر المقترح قد يؤخر استرداد التكلفة لما بعد 18 شهراً.",
      language
    ),
    suggestedNextStep: pickString(
      "Run a 4-week paid pilot with one Al Waha branch to validate booking volume, willingness-to-pay, and notification reliability before full build.",
      "تنفيذ تجربة مدفوعة لمدة أربعة أسابيع مع فرع واحد من الواحة لاختبار حجم الحجز والاستعداد للدفع وموثوقية الإشعارات قبل البناء الكامل.",
      language
    ),
  };
}

// ─── Combined fallback ───────────────────────────────────────────────────────

export function fallbackProjectIntelligence(
  language: PipelineLanguage = "english"
): ProjectIntelligenceOutput {
  return {
    businessUnderstanding: fallbackBusinessUnderstanding(language),
    businessAnalysis: fallbackBusinessAnalysis(language),
    businessRules: fallbackBusinessRules(language),
    technicalBlueprint: fallbackTechnicalBlueprint(language),
    executionPlan: fallbackExecutionPlan(language),
    finalDecision: fallbackFinalDecision(language),
  };
}
