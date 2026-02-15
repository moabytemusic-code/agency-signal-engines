"use client";

import React, { useState } from "react";
import {
    LocalSeoInput,
    SuccessResponse,
    ErrorResponse,
    LocalSeoResult,
} from "@/lib/types";
import Link from "next/link";

export default function LocalSeoClusterPage() {
    const [formData, setFormData] = useState<LocalSeoInput>({
        city: "Dallas",
        service: "Emergency Plumbing",
        audience: "Residential Homeowners",
        radius_miles: 25,
        count: 30,
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SuccessResponse | null>(null);
    const [error, setError] = useState<ErrorResponse | null>(null);

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const generateCluster = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = {
                request_id: `req_${Date.now()}`,
                input: formData,
            };

            const res = await fetch("/api/local-seo-cluster", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setResult(data as SuccessResponse);
            } else {
                setError(data as ErrorResponse);
            }
        } catch (err: any) {
            setError({
                ok: false,
                error: {
                    code: "INTERNAL_ERROR",
                    message: err.message || "Network error",
                },
            });
        } finally {
            setLoading(false);
        }
    };

    const copyJSON = () => {
        if (result) {
            navigator.clipboard.writeText(JSON.stringify(result, null, 2));
            alert("JSON copied!");
        }
    };

    const exportCSV = () => {
        if (!result) return;
        const seoResult = result.result as LocalSeoResult;

        // Header
        let csv = "title,slug,intent,primary_keyword\n";

        // Rows
        seoResult.supporting_pages.forEach(page => {
            // Simple CSV escaping
            const escapedTitle = page.title.includes(",") ? `"${page.title}"` : page.title;
            const escapedKey = page.primary_keyword.includes(",") ? `"${page.primary_keyword}"` : page.primary_keyword;
            csv += `${escapedTitle},${page.slug},${page.intent},${escapedKey}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `seo-cluster-${formData.city}-${formData.service}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Local SEO Cluster</h1>
                        <p className="text-gray-600">Module 3: Generate topical authority clusters for local services.</p>
                    </div>
                    <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        ← Back to Hub
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* INPUT FORM */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit space-y-6">

                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-800 border-b pb-2">Targeting</h3>
                            <InputField
                                label="City"
                                value={formData.city}
                                onChange={(val) => handleInputChange("city", val)}
                            />
                            <InputField
                                label="Service"
                                value={formData.service}
                                onChange={(val) => handleInputChange("service", val)}
                            />
                            <InputField
                                label="Audience (Optional)"
                                value={formData.audience || ""}
                                onChange={(val) => handleInputChange("audience", val)}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-800 border-b pb-2">Config</h3>
                            <InputField
                                label="Radius (Miles)"
                                value={formData.radius_miles || 25}
                                type="number"
                                onChange={(val) => handleInputChange("radius_miles", Number(val))}
                            />
                            <InputField
                                label="Article Count (15-75)"
                                value={formData.count || 30}
                                type="number"
                                onChange={(val) => handleInputChange("count", Number(val))}
                            />
                        </div>

                        <button
                            onClick={generateCluster}
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? "Generating Cluster..." : "Generate SEO Cluster"}
                        </button>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-700 rounded text-sm border border-red-200">
                                <strong>{error.error.code}</strong>: {error.error.message}
                                {error.error.fields && (
                                    <ul className="list-disc list-inside mt-1 text-xs">
                                        {Object.entries(error.error.fields).map(([k, v]) => <li key={k}>{k}: {v}</li>)}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RESULTS AREA */}
                    <div className="lg:col-span-2 space-y-6">
                        {!result && !loading && (
                            <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-dashed text-gray-400">
                                Enter details and click Generate.
                            </div>
                        )}

                        {result && (
                            (() => {
                                const seoResult = result.result as LocalSeoResult;
                                return (
                                    <>
                                        <div className="flex justify-end gap-2">
                                            <button onClick={exportCSV} className="text-sm bg-white border border-emerald-600 text-emerald-700 px-3 py-1 rounded hover:bg-emerald-50 font-medium">Download CSV</button>
                                            <button onClick={copyJSON} className="text-sm bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900">Copy JSON</button>
                                        </div>

                                        {/* Pillar Page */}
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <h3 className="font-bold text-gray-800 mb-1 flex items-center">
                                                <span className="mr-2 text-xl">🏛️</span> Pillar Page
                                            </h3>
                                            <div className="text-sm text-gray-500 mb-4">{seoResult.pillar.slug}</div>

                                            <h4 className="text-lg font-semibold text-emerald-800 mb-2">{seoResult.pillar.title}</h4>

                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Outline</h5>
                                                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                                                    {seoResult.pillar.outline.map((item, i) => <li key={i}>{item}</li>)}
                                                </ol>
                                            </div>
                                        </div>

                                        {/* Supporting Pages Table */}
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                                <span className="mr-2 text-xl">📄</span> Supporting Content ({seoResult.supporting_pages.length})
                                            </h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                                        <tr>
                                                            <th className="p-3">Title</th>
                                                            <th className="p-3">Intent</th>
                                                            <th className="p-3">Keyword</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {seoResult.supporting_pages.map((page, i) => (
                                                            <tr key={i} className="hover:bg-gray-50">
                                                                <td className="p-3 font-medium text-gray-900">{page.title}</td>
                                                                <td className="p-3">
                                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${page.intent === "COMMERCIAL" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                                                                        {page.intent}
                                                                    </span>
                                                                </td>
                                                                <td className="p-3 text-gray-500 font-mono text-xs">{page.primary_keyword}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* FAQ and Internal Links Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* FAQ */}
                                            <div className="bg-white p-5 rounded-xl border border-gray-100 h-96 overflow-y-auto">
                                                <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase sticky top-0 bg-white pb-2 border-b">FAQ Cluster</h4>
                                                <div className="space-y-4">
                                                    {seoResult.faq_cluster.map((faq, i) => (
                                                        <div key={i} className="text-sm">
                                                            <p className="font-semibold text-gray-800">Q: {faq.question}</p>
                                                            <p className="text-gray-600 mt-1">A: {faq.short_answer}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Internal Links */}
                                            <div className="bg-white p-5 rounded-xl border border-gray-100 h-96 overflow-y-auto">
                                                <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase sticky top-0 bg-white pb-2 border-b">Internal Link Map</h4>
                                                <div className="space-y-2 text-xs font-mono">
                                                    {seoResult.internal_link_map.map((link, i) => (
                                                        <div key={i} className="flex gap-2 p-2 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                                                            <div className="text-gray-400 w-1/3 truncate text-right">{link.from_slug}</div>
                                                            <div className="text-gray-300">→</div>
                                                            <div className="text-emerald-600 w-1/3 truncate">{link.to_slug}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
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

function InputField({ label, value, onChange, type = "text" }: { label: string, value: string | number, onChange: (val: string | number) => void, type?: string }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
        </div>
    );
}
