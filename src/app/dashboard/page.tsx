import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getPlanLimits } from '@/lib/plans';
import { getUserPlan } from '@/lib/billingUsage';
import ManageBillingButton from './ManageBillingButton'; // New client component

export const dynamic = 'force-dynamic';

export default async function DashboardHub() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Get Plan (default FREE)
    // Note: getUserPlan logic uses getUserPlan from billingUsage, which we will update
    // to reflect stripe status.
    const plan = await getUserPlan(user.id);
    const limits = getPlanLimits(plan);

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();

    // Get Usage for current month
    const now = new Date();
    const period = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

    // USE V2 TABLE
    const { data: usageData } = await supabase
        .from('usage_monthly_v2')
        .select('*')
        .eq('user_id', user.id)
        .eq('period', period)
        .single();

    // Get Stripe Metadata for UI
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id, stripe_status')
        .eq('user_id', user.id)
        .single();

    const usage = {
        profit: usageData?.profit || 0,
        script: usageData?.script || 0,
        seo: usageData?.seo || 0,
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Agency SignalEngines</h1>
                        <p className="text-gray-500 text-sm">Deterministic Growth Tools for Agencies</p>
                        <p className="text-gray-400 text-xs mt-1">
                            Signed in as <span className="font-semibold text-gray-700">{profile?.display_name || user.email?.split('@')[0]}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end mr-4">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold tracking-wide">
                                {plan} PLAN
                            </span>
                            {sub?.stripe_status && sub.stripe_status !== 'active' && sub.stripe_status !== 'trialing' && (
                                <span className="text-xs text-red-500 font-bold mt-1 uppercase">{sub.stripe_status}</span>
                            )}
                        </div>

                        {sub?.stripe_customer_id ? (
                            <ManageBillingButton />
                        ) : (
                            <Link
                                href="/pricing"
                                className="px-4 py-2 bg-emerald-600 text-white border border-transparent rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                            >
                                Upgrade
                            </Link>
                        )}

                        <form action="/logout" method="POST">
                            <button type="submit" className="text-sm text-gray-500 hover:text-gray-700 underline">
                                Logout
                            </button>
                        </form>
                    </div>
                </div>

                {/* USAGE SUMMARY */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <UsageCard label="Profit Forecasts" used={usage.profit} limit={limits.profit} />
                    <UsageCard label="Ad Scripts" used={usage.script} limit={limits.script} />
                    <UsageCard label="SEO Clusters" used={usage.seo} limit={limits.seo} />
                </div>

                {/* MODULE TILES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ModuleTile
                        title="Profit Forecaster"
                        desc="Compute break-even ROAS, CPA, and projection metrics instantly."
                        href="/dashboard/profit-forecaster"
                        remaining={limits.profit - usage.profit}
                        icon="📈"
                    />
                    <ModuleTile
                        title="Ad Script Engine"
                        desc="Generate high-converting hook/script variations for short-form ads."
                        href="/dashboard/ad-script-engine"
                        remaining={limits.script - usage.script}
                        icon="🎬"
                    />
                    <ModuleTile
                        title="Local SEO Cluster"
                        desc="Create topical authority clusters with pillar pages and FAQs."
                        href="/dashboard/local-seo-cluster"
                        remaining={limits.seo - usage.seo}
                        icon="📍"
                    />
                    <ModuleTile
                        title="Outbound Engine"
                        desc="Track LinkedIn + cold email outreach pipeline."
                        href="/dashboard/outbound"
                        remaining={9999}
                        icon="📫"
                    />
                </div>
            </div>
        </div>
    );
}

function UsageCard({ label, used, limit }: { label: string, used: number, limit: number }) {
    const percent = Math.min((used / limit) * 100, 100);
    const isFull = used >= limit;

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">{label}</span>
                <span className={`text-xs font-bold ${isFull ? "text-red-500" : "text-gray-400"}`}>
                    {used} / {limit > 1000 ? "∞" : limit}
                </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${isFull ? "bg-red-500" : "bg-blue-500"}`}
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
}

function ModuleTile({ title, desc, href, remaining, icon }: { title: string, desc: string, href: string, remaining: number, icon: string }) {
    const isLocked = remaining <= 0;

    return (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border transition-shadow hover:shadow-md flex flex-col h-full ${isLocked ? "border-red-100 opacity-80" : "border-gray-100"}`}>
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm mb-6 flex-grow">{desc}</p>

            <div className="flex items-center justify-between mt-auto">
                <span className={`text-xs font-medium ${isLocked ? "text-red-500" : "text-green-600"}`}>
                    {isLocked ? "Limit Reached" : `${remaining > 1000 ? "Unlimited" : remaining} remaining`}
                </span>
                <Link
                    href={href}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isLocked
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                        : "bg-gray-900 text-white hover:bg-black"
                        }`}
                >
                    {isLocked ? "Locked" : "Open Tool"}
                </Link>
            </div>
        </div>
    );
}
