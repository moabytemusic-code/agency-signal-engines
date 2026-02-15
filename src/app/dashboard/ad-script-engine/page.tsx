"use client";

import React, { useState } from "react";
import {
    AdScriptInput,
    SuccessResponse,
    ErrorResponse,
    AdScriptResult,
    AdPlatform,
    AdOfferType,
    AdTone,
} from "@/lib/types";
import Link from "next/link";

export default function AdScriptEnginePage() {
    const [formData, setFormData] = useState<AdScriptInput>({
        platform: "TIKTOK",
        industry: "Real Estate",
        offer: {
            type: "LEAD_GEN",
            primary_benefit: "Get Exclusive Home Listings",
            proof: "Over 500 happy families",
            cta: "Sign Up for Free Access",
        },
        audience: {
            who: "First-time Homebuyers",
            pain: "Spending hours searching outdated listings",
            objection: "I don't want to get spam calls",
        },
        style: {
            tone: "FRIENDLY",
            length_sec: 30,
        },
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SuccessResponse | null>(null);
    const [error, setError] = useState<ErrorResponse | null>(null);

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent: "offer" | "audience" | "style", field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value },
        }));
    };

    const generateScript = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = {
                request_id: `req_${Date.now()}`,
                input: formData,
            };

            const res = await fetch("/api/ad-script-engine", {
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

    const copyScriptPack = () => {
        if (!result) return;
        const res = result.result as AdScriptResult;
        let text = `AD SCRIPT PACK\nGenerated: ${new Date().toLocaleString()}\n\n`;

        text += `HOOKS:\n`;
        res.hooks.forEach(h => text += `- ${h.id}: ${h.text}\n`);
        text += `\n`;

        res.scripts.forEach(s => {
            text += `SCRIPT ${s.id} (${s.structure.beats.join(" > ")})\n`;
            text += `VOICEOVER: ${s.voiceover}\n`;
            text += `VISUALS: ${s.broll_shots.join(" | ")}\n`;
            text += `OVERLAY: ${s.on_screen_text.join(" | ")}\n`;
            text += `CTA: ${s.cta}\n\n`;
        });

        text += `COMPLIANCE NOTES:\n${res.compliance_notes.join("\n")}`;

        navigator.clipboard.writeText(text);
        alert("Script Pack copied!");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ad Script Engine</h1>
                        <p className="text-gray-600">Module 2: Generate high-converting video ad scripts.</p>
                    </div>
                    <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        ← Back to Hub
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* INPUT FORM */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit space-y-6">

                        {/* Platform & Industry */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-800 border-b pb-2">Context</h3>
                            <SelectField
                                label="Platform"
                                value={formData.platform}
                                options={["TIKTOK", "REELS", "YOUTUBE_SHORTS", "META_FEED", "META_STORY"]}
                                onChange={(val) => handleInputChange("platform", val)}
                            />
                            <InputField
                                label="Industry"
                                value={formData.industry}
                                onChange={(val) => handleInputChange("industry", val)}
                            />
                        </div>

                        {/* Offer */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-800 border-b pb-2">Offer</h3>
                            <SelectField
                                label="Type"
                                value={formData.offer.type}
                                options={["LEAD_GEN", "ECOM", "APPOINTMENT", "WEBINAR", "SERVICE"]}
                                onChange={(val) => handleNestedChange("offer", "type", val)}
                            />
                            <InputField
                                label="Primary Benefit"
                                value={formData.offer.primary_benefit}
                                onChange={(val) => handleNestedChange("offer", "primary_benefit", val)}
                            />
                            <InputField
                                label="Proof (Optional)"
                                value={formData.offer.proof || ""}
                                onChange={(val) => handleNestedChange("offer", "proof", val)}
                            />
                            <InputField
                                label="Call to Action (CTA)"
                                value={formData.offer.cta}
                                onChange={(val) => handleNestedChange("offer", "cta", val)}
                            />
                        </div>

                        {/* Audience */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-800 border-b pb-2">Audience</h3>
                            <InputField
                                label="Who are they?"
                                value={formData.audience.who}
                                onChange={(val) => handleNestedChange("audience", "who", val)}
                            />
                            <InputField
                                label="Main Pain Point"
                                value={formData.audience.pain}
                                onChange={(val) => handleNestedChange("audience", "pain", val)}
                            />
                            <InputField
                                label="Main Objection"
                                value={formData.audience.objection}
                                onChange={(val) => handleNestedChange("audience", "objection", val)}
                            />
                        </div>

                        {/* Style */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-800 border-b pb-2">Style</h3>
                            <SelectField
                                label="Tone"
                                value={formData.style.tone}
                                options={["DIRECT", "FRIENDLY", "AUTHORITATIVE", "URGENT"]}
                                onChange={(val) => handleNestedChange("style", "tone", val)}
                            />
                            <SelectField
                                label="Length"
                                value={String(formData.style.length_sec)}
                                options={["15", "30", "45"]}
                                onChange={(val) => handleNestedChange("style", "length_sec", Number(val))}
                            />
                        </div>

                        <button
                            onClick={generateScript}
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? "Generating..." : "Generate Scripts"}
                        </button>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-700 rounded text-sm border border-red-200">
                                <strong>{error.error.code}</strong>: {error.error.message}
                            </div>
                        )}
                    </div>

                    {/* RESULTS AREA */}
                    <div className="lg:col-span-2 space-y-6">
                        {!result && !loading && (
                            <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-dashed text-gray-400">
                                Configure your ad settings and click Generate.
                            </div>
                        )}

                        {loading && (
                            <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-dashed text-gray-400">
                                <span className="animate-pulse">Generating ad scripts... (Mock AI)</span>
                            </div>
                        )}

                        {result && (
                            <>
                                <div className="flex justify-end gap-2">
                                    <button onClick={copyScriptPack} className="text-sm bg-white border px-3 py-1 rounded hover:bg-gray-50">Copy Script Pack</button>
                                    <button onClick={copyJSON} className="text-sm bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900">Copy JSON</button>
                                </div>

                                {/* Hooks */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-800 mb-4">Top 5 Hooks</h3>
                                    <div className="space-y-2">
                                        {(result.result as AdScriptResult).hooks.map((hook) => (
                                            <div key={hook.id} className="p-3 bg-indigo-50 rounded border border-indigo-100 flex gap-3">
                                                <span className="font-mono text-indigo-600 font-bold">{hook.id}</span>
                                                <span className="text-gray-800">{hook.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Scripts */}
                                {(result.result as AdScriptResult).scripts.map((script) => (
                                    <div key={script.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-lg text-gray-900">Script {script.id}</h3>
                                            <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                                                {script.structure.beats.join(" > ")}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-2 space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase">Voiceover</label>
                                                    <p className="text-gray-800 whitespace-pre-wrap">{script.voiceover}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-400 uppercase">On Screen Text</label>
                                                        <ul className="list-disc list-inside text-sm text-gray-600">
                                                            {script.on_screen_text.map((t, i) => <li key={i}>{t}</li>)}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-400 uppercase">Visuals (B-Roll)</label>
                                                        <ul className="list-disc list-inside text-sm text-gray-600">
                                                            {script.broll_shots.map((t, i) => <li key={i}>{t}</li>)}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4 border-l pl-6">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase">Hook ID</label>
                                                    <div className="text-indigo-600 font-bold">{script.structure.hook_id}</div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase">CTA</label>
                                                    <div className="bg-gray-100 p-2 rounded text-center text-sm font-medium">{script.cta}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Compliance & Rebuttals */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-5 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase">Objection Handling</h4>
                                        {(result.result as AdScriptResult).objection_rebuttals.map((item, i) => (
                                            <div key={i} className="text-sm">
                                                <p className="font-semibold text-red-800">"{item.objection}"</p>
                                                <p className="text-gray-600 mt-1">↳ {item.response}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase">Compliance Notes</h4>
                                        <ul className="list-disc list-inside text-sm text-amber-700">
                                            {(result.result as AdScriptResult).compliance_notes.map((note, i) => (
                                                <li key={i}>{note}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputField({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
        </div>
    );
}

function SelectField({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (val: string) => void }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
}
