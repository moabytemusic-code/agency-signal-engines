export type Plan = "FREE" | "STARTER" | "GROWTH" | "WHITELABEL";

export type ModuleType = "PROFIT_FORECASTER" | "AD_SCRIPT_ENGINE" | "LOCAL_SEO_CLUSTER";

export interface User {
  user_id: string;
  plan: Plan;
}

export interface Limits {
  profit: number;
  script: number;
  seo: number;
}

export interface Usage {
  profit: number;
  script: number;
  seo: number;
  limits: Limits;
}

export interface ProfitForecasterInput {
  ad_budget: number;
  cpc: number;
  conversion_rate: number;
  aov: number;
  gross_margin?: number; // default 1.0
  agency_retainer?: number; // default 0
  target_profit?: number; // default 0
}

export type AdPlatform = "TIKTOK" | "REELS" | "YOUTUBE_SHORTS" | "META_FEED" | "META_STORY";
export type AdOfferType = "LEAD_GEN" | "ECOM" | "APPOINTMENT" | "WEBINAR" | "SERVICE";
export type AdTone = "DIRECT" | "FRIENDLY" | "AUTHORITATIVE" | "URGENT";

export interface AdOffer {
  type: AdOfferType;
  primary_benefit: string;
  proof?: string;
  cta: string;
}

export interface AdAudience {
  who: string;
  pain: string;
  objection: string;
}

export interface AdStyle {
  tone: AdTone;
  length_sec: 15 | 30 | 45;
}

export interface AdScriptInput {
  platform: AdPlatform;
  industry: string;
  offer: AdOffer;
  audience: AdAudience;
  style: AdStyle;
}

export interface LocalSeoInput {
  city: string;
  service: string;
  audience?: string;
  radius_miles?: number; // default 25
  count?: number; // default 30 (15-75)
}

export interface RequestEnvelope {
  request_id: string;
  module: ModuleType;
  user: User;
  usage: Usage;
  input: ProfitForecasterInput | AdScriptInput | LocalSeoInput;
}

export interface Insight {
  type: "NOTE" | "WARNING" | "ACTION";
  text: string;
}

export type RiskRating = "LOW" | "MEDIUM" | "HIGH";

export interface ProfitMetrics {
  clicks: number;
  conversions: number;
  revenue: number;
  gross_profit: number;
  net_profit_before_retainer: number;
  net_profit_after_retainer: number;
  cpa: number;
  breakeven_cpa: number;
  roas: number;
  breakeven_roas: number;
}

export interface ProfitTargets {
  required_revenue_for_target: number;
  required_conversions_for_target: number;
  required_cvr_for_target: number;
}

export interface ProfitForecasterResult {
  inputs_sanitized: Required<ProfitForecasterInput>;
  metrics: ProfitMetrics;
  targets: ProfitTargets;
  insights: Insight[];
  risk_rating: RiskRating;
}

export interface AdHook {
  id: string;
  text: string;
}

export interface AdScriptStructure {
  hook_id: string;
  beats: string[];
}

export interface AdScript {
  id: string;
  structure: AdScriptStructure;
  voiceover: string;
  on_screen_text: string[];
  broll_shots: string[];
  cta: string;
}

export interface AdObjectionRebuttal {
  objection: string;
  response: string;
}

export interface AdScriptResult {
  hooks: AdHook[];
  scripts: AdScript[];
  objection_rebuttals: AdObjectionRebuttal[];
  compliance_notes: string[];
}

export interface PillarPage {
  title: string;
  slug: string;
  intent: "COMMERCIAL";
  outline: string[];
}

export interface SupportingPage {
  title: string;
  slug: string;
  intent: "COMMERCIAL" | "INFORMATIONAL";
  primary_keyword: string;
}

export interface FaqItem {
  question: string;
  short_answer: string;
}

export interface InternalLink {
  from_slug: string;
  to_slug: string;
  anchor_text: string;
}

export interface LocalSeoResult {
  pillar: PillarPage;
  supporting_pages: SupportingPage[];
  faq_cluster: FaqItem[];
  internal_link_map: InternalLink[];
}

export interface SuccessResponse {
  ok: true;
  version: string;
  module: ModuleType;
  request_id: string;
  ts_utc: string;
  result: ProfitForecasterResult | AdScriptResult | LocalSeoResult;
}

export interface ErrorResponse {
  ok: false;
  error: {
    code: "BAD_REQUEST" | "VALIDATION_ERROR" | "LIMIT_EXCEEDED" | "INTERNAL_ERROR" | "UNSUPPORTED_REQUEST" | "INVALID_MODULE" | "UNAUTHORIZED";
    message: string;
    fields?: Record<string, string>;
  };
}

export type APIResponse = SuccessResponse | ErrorResponse;
