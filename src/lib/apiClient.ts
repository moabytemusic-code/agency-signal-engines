import { ErrorResponse, SuccessResponse } from "./types";

export interface ApiClientResult {
    ok: boolean;
    data: any; // Type generic later if needed
    error?: ErrorResponse;
}

export async function postJSON<T>(url: string, body: any): Promise<{ ok: true; data: T } | { ok: false; error: ErrorResponse }> {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (res.ok) {
            return { ok: true, data: data as T };
        } else {
            return { ok: false, error: data as ErrorResponse };
        }
    } catch (err: any) {
        return {
            ok: false,
            error: {
                ok: false,
                error: {
                    code: "INTERNAL_ERROR",
                    message: err.message || "Network error",
                },
            },
        };
    }
}
