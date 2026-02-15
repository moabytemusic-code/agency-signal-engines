import { NextRequest, NextResponse } from "next/server";
import { validateLocalSeoInput, generateCluster } from "@/lib/localSeoCluster";
import { createClient } from "@/lib/supabase/server";
import {
    getPeriodYYYYMM,
    getUserPlan,
    getOrCreateMonthlyUsage,
    enforceLimit,
    incrementUsage,
} from "@/lib/billingUsage";
import { getPlanLimits } from "@/lib/plans";
import { SuccessResponse, ErrorResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
    // 1. Auth Check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "UNAUTHORIZED",
                    message: "Login required",
                    fields: {},
                },
            } as ErrorResponse,
            { status: 401 }
        );
    }

    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "BAD_REQUEST",
                    message: "Invalid JSON",
                },
            } as ErrorResponse,
            { status: 400 }
        );
    }

    const { request_id, input } = body;

    if (!request_id || !input) {
        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "BAD_REQUEST",
                    message: "Missing request_id or input",
                },
            } as ErrorResponse,
            { status: 400 }
        );
    }

    // 2. Billing Check
    const period = getPeriodYYYYMM();
    const plan = await getUserPlan(user.id);
    const limits = getPlanLimits(plan);
    const usage = await getOrCreateMonthlyUsage(user.id, period);

    try {
        enforceLimit("seo", usage.seo, limits.seo);
    } catch (e: any) {
        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "LIMIT_EXCEEDED",
                    message: "Usage limit reached for Local SEO Cluster this month.",
                    fields: { period, limit: String(limits.seo), used: String(usage.seo) },
                },
            } as ErrorResponse,
            { status: 403 }
        );
    }

    // 3. Validate Input
    const inputValidation = validateLocalSeoInput(input);
    if (!inputValidation.ok || !inputValidation.sanitized) {
        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Invalid inputs",
                    fields: inputValidation.fields,
                },
            } as ErrorResponse,
            { status: 400 }
        );
    }

    // 4. Generate Cluster
    const result = generateCluster(inputValidation.sanitized);

    // 5. Increment Usage
    await incrementUsage(user.id, period, "seo");

    // 6. Response
    const response: SuccessResponse = {
        ok: true,
        version: "v1.0.0",
        module: "LOCAL_SEO_CLUSTER",
        request_id: request_id,
        ts_utc: new Date().toISOString(),
        result: result,
    };

    return NextResponse.json(response, { status: 200 });
}
