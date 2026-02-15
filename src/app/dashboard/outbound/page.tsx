
"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import Link from "next/link";
import { Plus, MessageSquare, Calendar, CheckCircle, XCircle, MoreHorizontal, Copy, Send, History } from "lucide-react";
import { getPlanLimits, PLAN_LIMITS } from "@/lib/plans";
import { Plan } from "@/lib/types";

type Prospect = {
    id: string;
    name: string;
    company: string;
    linkedin_url: string;
    email: string;
    niche: string;
    status: 'new' | 'connected' | 'messaged' | 'replied' | 'demo_booked' | 'closed' | 'not_interested';
    source: 'linkedin' | 'cold_email';
    last_contacted_at: string | null;
    followup_due_at: string | null;
    notes: string;
};

type Log = {
    id: string;
    type: string;
    subject: string;
    sent_at: string;
};

const STATUS_COLUMNS = [
    { id: 'new', label: 'New', color: 'bg-slate-100 border-slate-200' },
    { id: 'connected', label: 'Connected', color: 'bg-blue-50 border-blue-100' },
    { id: 'messaged', label: 'Messaged', color: 'bg-indigo-50 border-indigo-100' },
    { id: 'replied', label: 'Replied', color: 'bg-yellow-50 border-yellow-100' },
    { id: 'demo_booked', label: 'Demo Booked', color: 'bg-green-50 border-green-100' },
    { id: 'closed', label: 'Closed', color: 'bg-emerald-100 border-emerald-200' },
];

export default function OutboundDashboard() {
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [loading, setLoading] = useState(true);
    const [usage, setUsage] = useState({ used: 0, limit: 0, plan: 'FREE' as Plan });

    const [messageModal, setMessageModal] = useState<{ isOpen: boolean, prospect: Prospect | null, content: string, type: string }>({
        isOpen: false, prospect: null, content: "", type: ""
    });
    const [historyModal, setHistoryModal] = useState<{ isOpen: boolean, prospect: Prospect | null, logs: Log[] }>({
        isOpen: false, prospect: null, logs: []
    });
    const [generating, setGenerating] = useState(false);
    const [sending, setSending] = useState(false);

    const supabase = createClient();

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch Prospects
        const { data: prospectsData } = await supabase
            .from("prospects")
            .select("*")
            .eq("owner_user_id", user.id)
            .order("created_at", { ascending: false });

        if (prospectsData) setProspects(prospectsData as Prospect[]);

        // Fetch Usage
        const now = new Date();
        const period = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

        const { data: usageData } = await supabase
            .from('usage_monthly_v2')
            .select('outbound_email_used')
            .eq('user_id', user.id)
            .eq('period', period)
            .single();

        const { data: sub } = await supabase
            .from('subscriptions')
            .select('plan, stripe_status')
            .eq('user_id', user.id)
            .single();

        // Logic similar to billingUsage but client-side simplified
        let plan = (sub?.plan || 'FREE') as Plan;
        if (sub?.stripe_status && sub?.stripe_status !== 'active' && sub?.stripe_status !== 'trialing') {
            plan = 'FREE';
        }

        // Explicitly import limits logic
        // Using PLAN_LIMITS directly as getPlanLimits is just a lookup
        const limits = PLAN_LIMITS[plan] || PLAN_LIMITS['FREE'];

        setUsage({
            used: usageData?.outbound_email_used || 0,
            limit: limits.outbound_email,
            plan
        });

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Update Status
    const handleStatusChange = async (prospectId: string, newStatus: string) => {
        // Optimistic Update
        const oldProspects = [...prospects];
        const updatedProspects = prospects.map(p =>
            p.id === prospectId ? { ...p, status: newStatus as any } : p
        );
        setProspects(updatedProspects);

        let followupDue: string | null = null;
        if (newStatus === 'messaged') {
            const d = new Date();
            d.setDate(d.getDate() + 3);
            followupDue = d.toISOString();
        } else if (['replied', 'demo_booked', 'closed', 'not_interested'].includes(newStatus)) {
            followupDue = null;
        }

        const updates: any = { status: newStatus };
        if (followupDue !== undefined) updates.followup_due_at = followupDue;

        const { error } = await supabase
            .from("prospects")
            .update(updates)
            .eq("id", prospectId);

        if (error) {
            console.error("Status update failed", error);
            setProspects(oldProspects); // Revert
            alert("Failed to update status");
        }
    };

    // Generate Message
    const handleGenerate = async (prospect: Prospect, forceType?: string) => {
        setGenerating(true);
        let type = forceType || 'email_initial';

        if (!forceType) {
            if (prospect.source === 'linkedin') {
                if (prospect.status === 'new') type = 'connect';
                else if (prospect.status === 'connected') type = 'linkedin_followup';
            } else {
                if (prospect.status === 'new') type = 'email_initial';
                else if (prospect.status === 'messaged') type = 'email_followup';
            }
        }

        try {
            const res = await fetch("/api/outbound/generate-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prospect_id: prospect.id, type }) // Note: API expects 'type'
            });

            if (!res.ok) throw new Error("Generation failed");

            const { message } = await res.json();
            setMessageModal({ isOpen: true, prospect, content: message, type });

        } catch (e) {
            console.error(e);
            alert("Failed to generate message");
        } finally {
            setGenerating(false);
        }
    };

    // Send Email via Brevo
    const handleSendEmail = async () => {
        if (!messageModal.prospect || !messageModal.type.startsWith('email')) return;

        // Check limit client-side for UX
        if (usage.used >= usage.limit) {
            alert(`You have reached your monthly limit of ${usage.limit} emails. Please upgrade to send more.`);
            return;
        }

        setSending(true);
        try {
            const res = await fetch("/api/outbound/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prospect_id: messageModal.prospect.id,
                    type: messageModal.type // 'email_initial' or 'email_followup'
                })
            });

            if (!res.ok) {
                const err = await res.json();
                if (err.code === 'LIMIT_EXCEEDED') {
                    alert(`Limit Exceeded: You've used ${err.used} / ${err.limit} emails.`);
                } else {
                    alert(`Failed to send email: ${err.error || 'Unknown error'}`);
                }
                throw new Error(err.message);
            }

            alert("Email sent via Brevo!");
            setMessageModal({ ...messageModal, isOpen: false });
            fetchData(); // Refresh to update usage meter and logs

        } catch (e: any) {
            console.error(e);
            // Error already alerted
        } finally {
            setSending(false);
        }
    };

    // View Logs
    const handleViewLogs = async (prospect: Prospect) => {
        const { data } = await supabase
            .from("outbound_logs")
            .select("id, type, subject, sent_at")
            .eq("prospect_id", prospect.id)
            .order("sent_at", { ascending: false });

        setHistoryModal({ isOpen: true, prospect, logs: data as Log[] || [] });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(messageModal.content);
        alert("Copied directly to clipboard!");
    };

    // Filter for Follow-Ups
    const dueFollowUps = prospects.filter(p => {
        if (!p.followup_due_at) return false;
        const due = new Date(p.followup_due_at);
        const now = new Date();
        return due <= now && !['closed', 'not_interested'].includes(p.status);
    });

    const isLimitReached = usage.used >= usage.limit;
    const usagePercent = Math.min((usage.used / usage.limit) * 100, 100);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Engine...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header + Meter */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Outbound Engine</h1>
                        <p className="text-slate-500">Track LinkedIn & Email outreach pipeline.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-end md:items-center w-full md:w-auto">
                        {/* Usage Meter */}
                        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm w-full md:w-64">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-semibold text-slate-600">Email Sends</span>
                                <span className={`text-xs font-bold ${isLimitReached ? "text-red-500" : "text-slate-900"}`}>
                                    {usage.used} / {usage.limit}
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${isLimitReached ? "bg-red-500" : "bg-blue-500"}`}
                                    style={{ width: `${usagePercent}%` }}
                                ></div>
                            </div>
                            {isLimitReached && (
                                <Link href="/pricing" className="text-[10px] text-blue-600 hover:underline mt-1 block text-right">
                                    Upgrade Plan
                                </Link>
                            )}
                        </div>

                        <Link href="/dashboard/outbound/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
                            <Plus className="h-4 w-4" /> Add Prospect
                        </Link>
                    </div>
                </div>

                {/* Follow-Ups Section */}
                {dueFollowUps.length > 0 && (
                    <div className="mb-12 bg-white border border-yellow-200 rounded-xl p-6 shadow-sm ring-1 ring-yellow-400/20">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Calendar className="h-5 w-5 text-yellow-600" />
                            Today's Follow-Ups
                            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">{dueFollowUps.length} due</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dueFollowUps.map(p => (
                                <div key={p.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50 flex justify-between items-center group hover:border-blue-200 transition-colors">
                                    <div>
                                        <div className="font-semibold text-slate-900">{p.name}</div>
                                        <div className="text-xs text-slate-500">{p.company}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleGenerate(p, 'email_followup')}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
                                        >
                                            Send Follow-Up
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Kanban Board */}
                <div className="flex overflow-x-auto pb-8 gap-6 snap-x">
                    {STATUS_COLUMNS.map(col => {
                        const colProspects = prospects.filter(p => p.status === col.id);
                        return (
                            <div key={col.id} className={`flex-none w-80 rounded-xl border ${col.color} bg-opacity-30 flex flex-col h-full min-h-[500px] snap-center`}>
                                <div className="p-4 border-b border-inherit font-semibold text-slate-700 flex justify-between items-center bg-white/50 rounded-t-xl">
                                    {col.label}
                                    <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">{colProspects.length}</span>
                                </div>
                                <div className="p-4 space-y-3 flex-1 overflow-y-auto bg-slate-50/50">
                                    {colProspects.map(p => (
                                        <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-slate-900 truncate pr-2">{p.name}</h3>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${p.source === 'linkedin' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                                    {p.source === 'linkedin' ? 'LI' : 'EM'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 mb-3 truncate">{p.company}</p>

                                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                                                <select
                                                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-600 focus:ring-1 focus:ring-blue-500 outline-none max-w-[100px]"
                                                    value={p.status}
                                                    onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                                >
                                                    {STATUS_COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                                    <option value="not_interested">Not Interested</option>
                                                </select>

                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleGenerate(p)}
                                                        title="Generate Message"
                                                        className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                                                    >
                                                        <MessageSquare className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewLogs(p)}
                                                        title="History"
                                                        className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                                                    >
                                                        <History className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Message Modal */}
            {messageModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Generated Message</h3>
                            <button onClick={() => setMessageModal({ ...messageModal, isOpen: false })} className="text-slate-400 hover:text-slate-600">
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <textarea
                                readOnly
                                className="w-full h-64 p-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-mono text-sm focus:outline-none resize-none mb-4"
                                value={messageModal.content}
                            />
                            <div className="flex justify-between items-center gap-3">
                                <div className="text-xs text-slate-400">
                                    Type: <span className="font-medium text-slate-600">{messageModal.type}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={copyToClipboard}
                                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-2"
                                    >
                                        <Copy className="h-4 w-4" /> Copy
                                    </button>
                                    {messageModal.type.startsWith('email') && messageModal.prospect?.email && (
                                        <button
                                            onClick={handleSendEmail}
                                            disabled={sending || isLimitReached}
                                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2 shadow-sm disabled:opacity-50 ${isLimitReached ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                                            title={isLimitReached ? "Monthly Limit Reached" : ""}
                                        >
                                            <Send className="h-4 w-4" />
                                            {sending ? "Sending..." : "Send via Brevo"}
                                        </button>
                                    )}
                                </div>
                            </div>
                            {isLimitReached && messageModal.type.startsWith('email') && (
                                <p className="text-xs text-red-500 mt-2 text-right">Monthly email limit reached.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* History Modal */}
            {historyModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">History: {historyModal.prospect?.name}</h3>
                            <button onClick={() => setHistoryModal({ ...historyModal, isOpen: false })} className="text-slate-400 hover:text-slate-600">
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-0 max-h-[400px] overflow-y-auto">
                            {historyModal.logs.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 text-sm">No emails sent yet.</div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {historyModal.logs.map(log => (
                                        <div key={log.id} className="p-4 hover:bg-slate-50">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-semibold text-xs text-blue-600 uppercase tracking-wide">{log.type}</span>
                                                <span className="text-xs text-slate-400">{new Date(log.sent_at).toLocaleDateString()} {new Date(log.sent_at).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="text-sm font-medium text-slate-800 mb-1">{log.subject}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
