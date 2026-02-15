
"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewProspect() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        linkedin_url: "",
        email: "",
        niche: "",
        source: "linkedin", // Default
        notes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("Please login first.");
            router.push("/login");
            return;
        }

        const { error } = await supabase.from("prospects").insert([
            {
                owner_user_id: user.id,
                ...formData,
                status: "new",
                created_at: new Date().toISOString(),
            },
        ]);

        if (error) {
            console.error("Error creating prospect:", error);
            alert("Failed to create prospect.");
        } else {
            router.push("/dashboard/outbound");
        }
        setLoading(false);
    };

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/dashboard/outbound" className="text-slate-500 hover:text-slate-700">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Add New Prospect</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                        <input
                            type="text"
                            name="company"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                        <input
                            type="url"
                            name="linkedin_url"
                            placeholder="https://linkedin.com/in/..."
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.linkedin_url}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Niche</label>
                        <select
                            name="niche"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.niche}
                            onChange={handleChange}
                        >
                            <option value="">Select Niche...</option>
                            <option value="ecom">E-commerce</option>
                            <option value="leadgen">Lead Gen</option>
                            <option value="saas">SaaS</option>
                            <option value="local">Local Business</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                        <select
                            name="source"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.source}
                            onChange={handleChange}
                        >
                            <option value="linkedin">LinkedIn</option>
                            <option value="cold_email">Cold Email</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                    <textarea
                        name="notes"
                        rows={3}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={formData.notes}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
                    >
                        <Save className="h-4 w-4" />
                        {loading ? "Saving..." : "Save Prospect"}
                    </button>
                </div>
            </form>
        </div>
    );
}
