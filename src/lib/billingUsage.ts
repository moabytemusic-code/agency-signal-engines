import { createServiceClient } from "./supabase/service";
import { getPlanLimits } from "./plans";
import { Plan } from "./types";

export function getPeriodYYYYMM(d = new Date()) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
}

export async function getUserPlan(user_id: string): Promise<Plan> {
    const supabase = createServiceClient();
    const { data, error } = await supabase
        .from("subscriptions")
        .select("plan, stripe_status")
        .eq("user_id", user_id)
        .single();

    if (error || !data) {
        // Default to FREE if no subscription found
        return "FREE";
    }

    // Strict Enforcement: If status is not active/trialing, treat as FREE
    // This handles past_due, canceled, unpaid, etc.
    const status = data.stripe_status;
    if (status && status !== 'active' && status !== 'trialing') {
        return "FREE";
    }

    return data.plan as Plan;
}

export async function getOrCreateMonthlyUsage(user_id: string, period: string) {
    const supabase = createServiceClient();

    // Try to get existing usage
    // V2 TABLE NAME TO BYPASS STUCK SCHEMA CACHE
    const { data, error } = await supabase
        .from("usage_monthly_v2")
        .select("*")
        .eq("user_id", user_id)
        .eq("period", period)
        .single();

    if (data) {
        return data;
    }

    // If not found, create it
    const { data: newData, error: createError } = await supabase
        .from("usage_monthly_v2")
        .insert({ user_id, period, profit: 0, script: 0, seo: 0 })
        .select()
        .single();

    if (createError) {
        // If conflict (P0001 or 23505), it means created by another req. Retry fetch.
        if (createError.code === '23505' || createError.message?.includes('duplicate key')) {
            const { data: retryData } = await supabase
                .from("usage_monthly_v2")
                .select("*")
                .eq("user_id", user_id)
                .eq("period", period)
                .single();
            return retryData;
        }

        console.error("FULL CREATE ERROR:", JSON.stringify(createError, null, 2));
        throw new Error(`Could not track usage: ${createError.message} (${createError.code})`);
    }

    return newData;
}

export function enforceLimit(
    moduleKey: "profit" | "script" | "seo",
    used: number,
    limit: number
) {
    if (used >= limit) {
        const error = new Error("Usage limit exceeded for this module.");
        (error as any).code = "LIMIT_EXCEEDED";
        throw error;
    }
}

export async function incrementUsage(
    userId: string,
    period: string,
    moduleKey: "profit" | "script" | "seo"
) {
    const supabase = createServiceClient();

    const { error } = await supabase.rpc("increment_usage_monthly", {
        p_user_id: userId,
        p_period: period,
        p_module: moduleKey
    });

    if (error) throw new Error(`Usage increment failed: ${error.message}`);
}
