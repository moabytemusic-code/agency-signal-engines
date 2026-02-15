import {
    RequestEnvelope,
    ProfitForecasterInput,
    Usage,
    User,
    ErrorResponse,
} from "./types";

export interface ValidationSuccess {
    ok: true;
    sanitized: Required<ProfitForecasterInput>;
}

export interface ValidationError {
    ok: false;
    fields: Record<string, string>;
}

export type ValidationResult = ValidationSuccess | ValidationError;

export function validateEnvelope(
    body: any
): { ok: true; data: RequestEnvelope } | ErrorResponse {
    if (!body) {
        return {
            ok: false,
            error: {
                code: "BAD_REQUEST",
                message: "Envelope missing",
                fields: { reason: "Input provided was not a valid JSON" },
            },
        };
    }

    // Basic structure check
    if (!body.request_id || !body.module || !body.user || !body.usage || !body.input) {
        return {
            ok: false,
            error: {
                code: "BAD_REQUEST",
                message: "Envelope malformed",
                fields: {
                    request_id: !body.request_id ? "Missing" : undefined,
                    module: !body.module ? "Missing" : undefined,
                    user: !body.user ? "Missing" : undefined,
                    usage: !body.usage ? "Missing" : undefined,
                    input: !body.input ? "Missing" : undefined,
                },
            },
        };
    }

    const validModules = ["PROFIT_FORECASTER", "AD_SCRIPT_ENGINE", "LOCAL_SEO_CLUSTER"];
    if (!validModules.includes(body.module)) {
        return {
            ok: false,
            error: {
                code: "INVALID_MODULE",
                message: "Module not recognized",
                fields: { module: body.module }
            }
        };
    }

    return { ok: true, data: body as RequestEnvelope };
}

export function validateProfitInput(input: any): ValidationResult {
    const fields: Record<string, string> = {};
    const sanitized: Partial<Required<ProfitForecasterInput>> = {};

    // ad_budget > 0
    if (typeof input.ad_budget !== 'number' || input.ad_budget <= 0) {
        fields.ad_budget = "Must be a number > 0";
    } else {
        sanitized.ad_budget = input.ad_budget;
    }

    // cpc > 0
    if (typeof input.cpc !== 'number' || input.cpc <= 0) {
        fields.cpc = "Must be a number > 0";
    } else {
        sanitized.cpc = input.cpc;
    }

    // 0 < conversion_rate <= 1
    if (typeof input.conversion_rate !== 'number' || input.conversion_rate <= 0 || input.conversion_rate > 1) {
        fields.conversion_rate = "Must be > 0 and <= 1";
    } else {
        sanitized.conversion_rate = input.conversion_rate;
    }

    // aov > 0
    if (typeof input.aov !== 'number' || input.aov <= 0) {
        fields.aov = "Must be a number > 0";
    } else {
        sanitized.aov = input.aov;
    }

    // gross_margin (optional; default 1.0)
    if (input.gross_margin === undefined || input.gross_margin === null) {
        sanitized.gross_margin = 1.0;
    } else if (typeof input.gross_margin !== 'number' || input.gross_margin <= 0 || input.gross_margin > 1) {
        fields.gross_margin = "Must be > 0 and <= 1";
    } else {
        sanitized.gross_margin = input.gross_margin;
    }

    // agency_retainer (optional; default 0)
    if (input.agency_retainer === undefined || input.agency_retainer === null) {
        sanitized.agency_retainer = 0;
    } else if (typeof input.agency_retainer !== 'number' || input.agency_retainer < 0) {
        fields.agency_retainer = "Must be >= 0";
    } else {
        sanitized.agency_retainer = input.agency_retainer;
    }

    // target_profit (optional; default 0)
    if (input.target_profit === undefined || input.target_profit === null) {
        sanitized.target_profit = 0;
    } else if (typeof input.target_profit !== 'number' || input.target_profit < 0) {
        fields.target_profit = "Must be >= 0";
    } else {
        sanitized.target_profit = input.target_profit;
    }

    if (Object.keys(fields).length > 0) {
        return { ok: false, fields };
    }

    return { ok: true, sanitized: sanitized as Required<ProfitForecasterInput> };
}
