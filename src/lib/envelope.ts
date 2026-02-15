import { ModuleType, Plan, Usage, RequestEnvelope } from "./types";
import { getClientPlan, getClientUsage } from "./clientState";

export function buildEnvelope<T>(module: ModuleType, input: T): RequestEnvelope {
    const plan = getClientPlan();
    const usage = getClientUsage();

    // Create a random request ID
    const requestId = `req_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;

    return {
        request_id: requestId,
        module: module,
        user: {
            user_id: "demo_user", // Fixed demo user for now
            plan: plan,
        },
        usage: usage,
        input: input,
    };
}
