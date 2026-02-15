"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { Plan } from "@/lib/types";
import { getPlanLimits } from "@/lib/plans";

const PLANS: Plan[] = ["FREE", "STARTER", "GROWTH", "WHITELABEL"];

const PRICING = {
    FREE: 0,
    STARTER: 79,
    GROWTH: 149,
    WHITELABEL: 249,
};

export default function PricingPage() {
    const [currentPlan, setCurrentPlan] = useState<Plan>("FREE");
    const [loading, setLoading] = useState(false);
    const [userValues, setUserValues] = useState<{ id: string | null } | null>(null);

    useEffect(() => {
        const fetchPlan = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUserValues({ id: user.id });
                const { data: sub } = await supabase
                    .from("subscriptions")
                    .select("plan")
                    .eq("user_id", user.id)
                    .single();

                if (sub) {
                    setCurrentPlan(sub.plan as Plan);
                }
            }
        };

        fetchPlan();
    }, []);

    const handleCheckout = async (plan: Plan) => {
        if (!userValues?.id) {
            window.location.href = "/login?next=/pricing";
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan }),
            });

            if (!res.ok) throw new Error("Checkout failed");

            const { url } = await res.json();
            if (url) {
                window.location.href = url;
            } else {
                alert("Something went wrong initiating checkout.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Failed to start checkout. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
                <p className="text-xl text-gray-600 mb-12">Scale your agency with predictable pricing.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {PLANS.map((plan) => {
                        const limits = getPlanLimits(plan);
                        const isCurrent = currentPlan === plan;

                        return (
                            <div key={plan} className={`bg-white rounded-2xl shadow-lg p-8 border hover:shadow-xl transition-shadow flex flex-col items-center
                                ${isCurrent ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-50" : "border-gray-200"}`}>

                                <h3 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">{plan}</h3>
                                <div className="text-4xl font-extrabold text-blue-600 mb-6">
                                    ${PRICING[plan]}
                                    <span className="text-base font-medium text-gray-500">/mo</span>
                                </div>

                                <ul className="text-left w-full space-y-3 mb-8 text-gray-600 text-sm flex-grow">
                                    <LimitItem label="Profit Forecasts" value={limits.profit} />
                                    <LimitItem label="Ad Scripts" value={limits.script} />
                                    <LimitItem label="SEO Clusters" value={limits.seo} />
                                </ul>

                                <button
                                    onClick={() => handleCheckout(plan)}
                                    disabled={loading || isCurrent}
                                    className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200
                                        ${isCurrent
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        }
                                        ${loading ? "opacity-75 cursor-wait" : ""}
                                    `}
                                >
                                    {loading && !isCurrent ? "Loading..." : isCurrent ? "Current Plan" : plan === "FREE" ? "Downgrade" : "Upgrade Now"}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-4">
                        ← Back to Dashboard
                    </Link>
                    <Link href="/" className="ml-8 text-gray-500 hover:text-gray-800 font-medium underline underline-offset-4">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

function LimitItem({ label, value }: { label: string, value: number }) {
    return (
        <li className="flex justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
            <span>{label}</span>
            <span className="font-semibold">{value > 1000 ? "Unlimited" : value}</span>
        </li>
    );
}
