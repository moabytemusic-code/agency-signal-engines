import { Limits, Plan } from "./types";

export const PLAN_LIMITS: Record<Plan, Limits> = {
    FREE: { profit: 5, script: 5, seo: 10, outbound_email: 0 },
    STARTER: { profit: 50, script: 50, seo: 50, outbound_email: 50 },
    GROWTH: { profit: 200, script: 200, seo: 200, outbound_email: 300 },
    WHITELABEL: { profit: 999999, script: 999999, seo: 999999, outbound_email: 1500 },
};

export const PLANS: Plan[] = ["FREE", "STARTER", "GROWTH", "WHITELABEL"];

export function getPlanLimits(plan: Plan): Limits {
    return PLAN_LIMITS[plan] || PLAN_LIMITS["FREE"];
}

export function getDefaultPlan(): Plan {
    return "STARTER";
}
