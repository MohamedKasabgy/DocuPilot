import type { ScopeAnalysisOutput } from "@/lib/ai/schemas/scope";
import type { ScopeLanguage } from "@/lib/ai/prompts/scope";

const MOBILE_KEYWORDS = [
  "mobile", "ios", "android", "app store", "play store",
  "تطبيق", "موبايل", "جوال", "هاتف", "اندرويد", "ايفون",
];

function pickString(en: string, ar: string, language: ScopeLanguage, requestText: string): string {
  const isArRequest = /[؀-ۿ]/.test(requestText);
  const lang = language === "auto" ? (isArRequest ? "arabic" : "english") : language;
  if (lang === "english") return en;
  if (lang === "arabic") return ar;
  return `${en} / ${ar}`;
}

function isMobileAppRequest(s: string): boolean {
  const lower = s.toLowerCase();
  return MOBILE_KEYWORDS.some((kw) => lower.includes(kw));
}

export function fallbackScopeAnalysis(
  newRequest: string,
  language: ScopeLanguage = "auto"
): ScopeAnalysisOutput {
  if (isMobileAppRequest(newRequest)) {
    return {
      scopeStatus: "out_of_scope",
      reason: pickString(
        "The current contract and SRS cover the web platform and admin dashboard only. Native iOS and Android applications introduce separate codebases, app-store compliance work, and a parallel release pipeline that are not part of the existing engagement.",
        "يغطي العقد والمواصفات الحالية المنصة الإلكترونية ولوحة الإدارة فقط. تطوير تطبيقات iOS و Android الأصلية يتطلب قواعد كود منفصلة والتزامات بمتاجر التطبيقات وخط إصدار موازٍ، وهي خارج نطاق الاتفاق الحالي.",
        language,
        newRequest
      ),
      timelineImpact: "high",
      costImpact: "high",
      businessImpact: "medium",
      riskImpact: "high",
      strategicImpact: pickString(
        "Mobile presence is a credible expansion path for the platform's reach, but it should be priced and contracted as a separate phase, not absorbed into the current build.",
        "وجود تطبيق جوال يمثل توسعاً منطقياً لتغطية المنصة، إلا أنه يجب تسعيره والتعاقد عليه كمرحلة منفصلة لا كجزء من المشروع الحالي.",
        language,
        newRequest
      ),
      recommendation: "convert_to_change_request",
      suggestedAction: pickString(
        "Open a formal Change Request (CR) under the current project and prepare a separate estimate covering iOS and Android scope, timeline, and price within 3–5 business days.",
        "افتح طلب تغيير رسمياً ضمن المشروع الحالي، وأعدّ تقديراً منفصلاً يغطي نطاق وزمن وتكلفة تطبيقي iOS و Android خلال 3 إلى 5 أيام عمل.",
        language,
        newRequest
      ),
      clientReply: pickString(
        "Dear Client,\n\nThank you for raising the request to add native iOS and Android applications to the platform.\n\nAfter reviewing our current engagement, native mobile applications fall outside the scope of the present contract, which covers the web platform and admin dashboard. We would be glad to take this forward as a formal Change Request — our team will share a separate estimate of timeline and cost for the mobile workstream within 3–5 business days, so you can review the impact before we commit anything to the schedule.\n\nIn the meantime, please let us know whether the priority is iOS, Android, or both, and any deadline you have in mind.\n\nBest regards,\nProject Management Team",
        "العميل الكريم،\n\nشكراً لتواصلكم معنا بشأن إضافة تطبيقات iOS و Android للمنصة.\n\nبعد مراجعة الاتفاق الحالي، تطوير تطبيقات الجوال خارج نطاق العقد القائم الذي يغطي المنصة الإلكترونية ولوحة الإدارة. سيسعدنا التعامل مع هذا الطلب من خلال طلب تغيير رسمي، وسنشارككم تقديراً منفصلاً للزمن والتكلفة الخاصة بمسار الجوال خلال 3 إلى 5 أيام عمل لمراجعته قبل أي التزام بالجدول.\n\nنرجو إعلامنا أيضاً ما إذا كانت الأولوية لـ iOS أو Android أو كليهما، وأي موعد مستهدف لديكم.\n\nمع خالص التقدير،\nفريق إدارة المشروع",
        language,
        newRequest
      ),
      changeRequestSummary: pickString(
        "Add native iOS and Android mobile applications to the platform. Estimated additional timeline of 12–16 weeks beyond the current MVP delivery date and a separate budget line. Requires a dedicated mobile lead, design adaptation for mobile, and a parallel release pipeline including App Store and Google Play submission.",
        "إضافة تطبيقات iOS و Android الأصلية للمنصة. الزمن الإضافي المتوقع 12 إلى 16 أسبوعاً بعد موعد إطلاق النسخة الأولى الحالية، مع بند ميزانية منفصل. يتطلب قائد فريق جوال مخصص، وتكييف التصميم للجوال، وخط إصدار موازٍ يشمل التقديم لمتجري آبل وجوجل بلاي.",
        language,
        newRequest
      ),
      confidenceScore: 88,
    };
  }

  return {
    scopeStatus: "needs_clarification",
    reason: pickString(
      "The request overlaps with several active SRS items but is not described in enough detail to confirm whether it falls inside the current contract scope. Additional context from the client is needed before classification.",
      "يتقاطع الطلب مع عدة بنود نشطة في المواصفات، لكنه غير موصوف بتفاصيل كافية للتأكد من اندراجه ضمن نطاق العقد الحالي. مطلوب توضيح إضافي من العميل قبل التصنيف.",
      language,
      newRequest
    ),
    timelineImpact: "medium",
    costImpact: "medium",
    businessImpact: "medium",
    riskImpact: "medium",
    strategicImpact: pickString(
      "Likely a useful enhancement that fits the project's direction, pending the client's clarification.",
      "تحسين مفيد على الأرجح وينسجم مع توجه المشروع، بانتظار توضيح العميل.",
      language,
      newRequest
    ),
    recommendation: "convert_to_change_request",
    suggestedAction: pickString(
      "Send a clarification email to the client listing two or three specific questions, then prepare a CR if the answers confirm the request is outside current scope.",
      "أرسل بريد توضيح للعميل بسؤالين أو ثلاثة محددة، ثم جهّز طلب تغيير إذا أكدت الإجابات أن الطلب خارج النطاق الحالي.",
      language,
      newRequest
    ),
    clientReply: pickString(
      "Dear Client,\n\nThank you for your request. To make sure we scope this accurately against our current engagement, could you confirm a few details: the specific use cases you have in mind, the priority relative to the existing roadmap, and any deadline you are working towards?\n\nOnce we have that, we will respond with whether this fits inside the current scope or whether a formal Change Request will be the right path.\n\nBest regards,\nProject Management Team",
      "العميل الكريم،\n\nشكراً لطلبكم. لضمان تقييمه بدقة مقابل الاتفاق الحالي، نرجو توضيح بعض النقاط: حالات الاستخدام المحددة التي تفكرون بها، وأولويتها بالنسبة لخارطة الطريق الحالية، وأي موعد مستهدف لديكم.\n\nبمجرد توفر هذه التفاصيل، سنردّ بما إذا كان الطلب ضمن النطاق الحالي أو يستوجب طلب تغيير رسمياً.\n\nمع خالص التقدير،\nفريق إدارة المشروع",
      language,
      newRequest
    ),
    changeRequestSummary: pickString(
      "Pending clarification from the client. If confirmed as out of scope, this CR will capture the specific deliverables, timeline shift, and cost impact.",
      "بانتظار توضيح العميل. حال تأكيد خروجه عن النطاق، سيغطي طلب التغيير المخرجات المحددة وأثر الزمن والتكلفة.",
      language,
      newRequest
    ),
    confidenceScore: 55,
  };
}
