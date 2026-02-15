import { Limits, Plan, Usage } from "./types";
import { getPlanLimits, getDefaultPlan } from "./plans";

const KEY_PLAN = "agency_current_plan";
const KEY_USAGE = "agency_current_usage";

export interface ClientState {
    plan: Plan;
    usage: {
        profit: number;
        script: number;
        seo: number;
        outbound_email: number;
    };
}

export function getClientPlan(): Plan {
    if (typeof window === "undefined") return getDefaultPlan();
    const stored = localStorage.getItem(KEY_PLAN);
    return (stored as Plan) || getDefaultPlan();
}

export function setClientPlan(plan: Plan) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY_PLAN, plan);
}

export function getClientUsage(): Usage {
    const plan = getClientPlan();
    const limits = getPlanLimits(plan);

    if (typeof window === "undefined") {
        return { profit: 0, script: 0, seo: 0, outbound_email: 0, limits };
    }

    const storedUsage = localStorage.getItem(KEY_USAGE);
    let currentUsage = { profit: 0, script: 0, seo: 0, outbound_email: 0 };

    if (storedUsage) {
        try {
            currentUsage = JSON.parse(storedUsage);
        } catch {
            // ignore parse error
        }
    }

    return {
        ...currentUsage,
        limits,
    };
}

export function incrementUsage(moduleKey: "profit" | "script" | "seo" | "outbound_email") {
    if (typeof window === "undefined") return;

    const current = getClientUsage();
    const newUsage = {
        profit: current.profit,
        script: current.script,
        seo: current.seo,
        outbound_email: current.outbound_email,
    };

    newUsage[moduleKey] += 1;
    localStorage.setItem(KEY_USAGE, JSON.stringify(newUsage));
}

export function resetUsage() {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY_USAGE, JSON.stringify({ profit: 0, script: 0, seo: 0, outbound_email: 0 }));
}
