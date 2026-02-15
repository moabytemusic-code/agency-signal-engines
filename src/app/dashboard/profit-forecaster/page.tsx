"use client";

import React, { useState } from "react";
import {
    ProfitForecasterInput,
    SuccessResponse,
    ErrorResponse,
    ProfitMetrics,
    ProfitTargets,
    Insight,
    RiskRating,
    ProfitForecasterResult,
} from "@/lib/types";
import Link from "next/link";

export default function ProfitForecasterPage() {
    const [formData, setFormData] = useState<ProfitForecasterInput>({
        ad_budget: 1000,
        cpc: 2.5,
        conversion_rate: 0.02,
        aov: 150,
        gross_margin: 0.6,
        agency_retainer: 500,
        target_profit: 1000,
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SuccessResponse | null>(null);
    const [error, setError] = useState<ErrorResponse | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: parseFloat(value) || 0,
        }));
    };

    const calculate = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = {
                request_id: `req_${Date.now()}`,
                input: formData,
            };

            const res = await fetch("/api/profit-forecaster", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setResult(data as SuccessResponse);
            } else {
                console.error("API Error:", data);
                if (data.error) {
                    setError(data as ErrorResponse);
                } else {
                    // Fallback for non-standard errors (e.g. Supabase DB errors)
                    setError({
                        ok: false,
                        error: {
                            code: "INTERNAL_ERROR",
                            message: data.message || JSON.stringify(data),
                            fields: data.details ? { details: data.details } : undefined
                        }
                    });
                }
            }
        } catch (err) {
            setError({
                ok: false,
                error: {
                    code: "INTERNAL_ERROR",
                    message: "Network error or unexpected failure",
                },
            });
        } finally {
            setLoading(false);
        }
    };

    const copyJSON = () => {
        if (result) {
            navigator.clipboard.writeText(JSON.stringify(result, null, 2));
            alert("JSON copied to clipboard!");
        }
    };

    const copySummary = () => {
        if (result) {
            const profitResult = result.result as ProfitForecasterResult;
            const { metrics, risk_rating } = profitResult;
            const summary = `
Profit Forecast Summary
-----------------------
Risk Rating: ${risk_rating}
Ad Spend: $${formData.ad_budget}
Revenue: $${metrics.revenue}
Net Profit (After Retainer): $${metrics.net_profit_after_retainer}
ROAS: ${metrics.roas} (Breakeven: ${metrics.breakeven_roas})
CPA: $${metrics.cpa} (Breakeven: $${metrics.breakeven_cpa})
      `.trim();
            navigator.clipboard.writeText(summary);
            alert("Summary copied to clipboard!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Profit Forecaster
                        </h1>
                        <p className="text-gray-600">
                            Module 1: Compute break-even and projection metrics.
                        </p>
                    </div>
                    <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        ← Back to Hub
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Campaign Inputs
                        </h2>
                        <div className="space-y-4">
                            <InputField
                                label="Ad Budget ($)"
                                name="ad_budget"
                                value={formData.ad_budget}
                                onChange={handleChange}
                            />
                            <InputField
                                label="CPC ($)"
                                name="cpc"
                                value={formData.cpc}
                                onChange={handleChange}
                                step={0.01}
                            />
                            <InputField
                                label="Conv. Rate (0-1)"
                                name="conversion_rate"
                                value={formData.conversion_rate}
                                onChange={handleChange}
                                step={0.01}
                                hint="e.g. 0.02 for 2%"
                            />
                            <InputField
                                label="AOV ($)"
                                name="aov"
                                value={formData.aov}
                                onChange={handleChange}
                            />
                            <InputField
                                label="Gross Margin (0-1)"
                                name="gross_margin"
                                value={formData.gross_margin || 1.0}
                                onChange={handleChange}
                                step={0.01}
                            />
                            <InputField
                                label="Agency Retainer ($)"
                                name="agency_retainer"
                                value={formData.agency_retainer || 0}
                                onChange={handleChange}
                            />
                            <InputField
                                label="Target Profit ($)"
                                name="target_profit"
                                value={formData.target_profit || 0}
                                onChange={handleChange}
                            />

                            <button
                                onClick={calculate}
                                disabled={loading}
                                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Calculating..." : "Calculate Forecast"}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
                                <strong>Error:</strong> {error.error.message}
                                {error.error.fields && (
                                    <ul className="list-disc list-inside mt-1">
                                        {Object.entries(error.error.fields).map(([k, v]) => (
                                            <li key={k}>
                                                {k}: {v}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Results Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {!result && !loading && !error && (
                            <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                                Enter inputs and click Calculate to see results.
                            </div>
                        )}

                        {result && (
                            (() => {
                                const profitResult = result.result as ProfitForecasterResult;
                                return (
                                    <>
                                        {/* Metrics Cards */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <MetricCard
                                                label="Net Profit"
                                                value={`$${profitResult.metrics.net_profit_after_retainer}`}
                                                highlight={profitResult.metrics.net_profit_after_retainer >= 0}
                                            />
                                            <MetricCard
                                                label="ROAS"
                                                value={`${profitResult.metrics.roas}x`}
                                                sub={`vs ${profitResult.metrics.breakeven_roas}x BE`}
                                                highlight={
                                                    profitResult.metrics.roas >=
                                                    profitResult.metrics.breakeven_roas
                                                }
                                            />
                                            <MetricCard
                                                label="CPA"
                                                value={`$${profitResult.metrics.cpa}`}
                                                sub={`vs $${profitResult.metrics.breakeven_cpa} BE`}
                                                highlight={
                                                    profitResult.metrics.cpa <=
                                                    profitResult.metrics.breakeven_cpa
                                                }
                                            />
                                            <MetricCard
                                                label="Revenue"
                                                value={`$${profitResult.metrics.revenue}`}
                                            />
                                        </div>

                                        {/* Risk and Insights */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                                <h3 className="font-semibold text-gray-700">Analysis</h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${profitResult.risk_rating === "HIGH"
                                                        ? "bg-red-100 text-red-700"
                                                        : profitResult.risk_rating === "MEDIUM"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-green-100 text-green-700"
                                                        }`}
                                                >
                                                    RISK: {profitResult.risk_rating}
                                                </span>
                                            </div>
                                            <div className="p-6">
                                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                                    Insights
                                                </h4>
                                                <div className="space-y-3">
                                                    {profitResult.insights.map((insight, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`p-3 rounded-lg border-l-4 text-sm ${insight.type === "WARNING"
                                                                ? "bg-orange-50 border-orange-400 text-orange-800"
                                                                : insight.type === "ACTION"
                                                                    ? "bg-blue-50 border-blue-400 text-blue-800"
                                                                    : "bg-gray-50 border-gray-400 text-gray-800"
                                                                }`}
                                                        >
                                                            <span className="font-bold mr-2">
                                                                {insight.type}:
                                                            </span>
                                                            {insight.text}
                                                        </div>
                                                    ))}
                                                </div>

                                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">
                                                    Targets
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div className="p-3 bg-gray-50 rounded">
                                                        <div className="text-gray-500">Req. Revenue</div>
                                                        <div className="font-mono font-medium">
                                                            ${profitResult.targets.required_revenue_for_target}
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-gray-50 rounded">
                                                        <div className="text-gray-500">Req. Conversions</div>
                                                        <div className="font-mono font-medium">
                                                            {profitResult.targets.required_conversions_for_target}
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-gray-50 rounded">
                                                        <div className="text-gray-500">Req. CVR</div>
                                                        <div className="font-mono font-medium">
                                                            {(
                                                                profitResult.targets.required_cvr_for_target * 100
                                                            ).toFixed(2)}
                                                            %
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-4">
                                            <button
                                                onClick={copyJSON}
                                                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                                            >
                                                Copy Full JSON
                                            </button>
                                            <button
                                                onClick={copySummary}
                                                className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                                            >
                                                Copy Summary
                                            </button>
                                        </div>
                                    </>
                                );
                            })()
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputField({
    label,
    name,
    value,
    onChange,
    step,
    hint,
}: {
    label: string;
    name: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    step?: number;
    hint?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type="number"
                name={name}
                value={value}
                onChange={onChange}
                step={step || "any"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
            {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
        </div>
    );
}

function MetricCard({
    label,
    value,
    sub,
    highlight,
}: {
    label: string;
    value: string;
    sub?: string;
    highlight?: boolean;
}) {
    let colorClass = "bg-white border-gray-100 text-gray-900";
    if (highlight === true) colorClass = "bg-green-50 border-green-100 text-green-900";
    if (highlight === false) colorClass = "bg-red-50 border-red-100 text-red-900";

    return (
        <div className={`p-4 rounded-xl shadow-sm border ${colorClass} text-center`}>
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {label}
            </div>
            <div className="text-xl font-bold truncate">{value}</div>
            {sub && <div className="text-xs opacity-75 mt-1">{sub}</div>}
        </div>
    );
}
