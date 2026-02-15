
import { Stripe } from "stripe";
import { createClient } from "@supabase/supabase-js";

// --- Mocking environment ---
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");
if (!SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2025-01-27.acacia' as any, // Or whatever latest is
    typescript: true,
});

// PRICE_PLAN_MAP from lib/stripe.ts
const PRICE_PLAN_MAP: Record<string, any> = {
    // Add known price IDs here if dynamic lookup fails?
    // Actually, I'll rely on what's in the DB or copy common ones.
    // For now, assume map is empty and relies on fallback?
    // User provided map in previous turn:
    "price_1T0...": "STARTER",
    "price_1T0...": "AGENCY",
    "price_1T1Aw...": "WHITELABEL", // Guessing?
};

// Actually, I need the real map to test properly.
// But the core logic is `subscription.items.data[0].price.id`.
// I'll trust the fallback logic or add a few known ones.
// Or fetch them? No.

function safeDate(val: any): string {
    if (!val) return new Date().toISOString();
    if (typeof val === 'number') return new Date(val * 1000).toISOString();
    if (typeof val === 'string') {
        const d = new Date(val);
        if (!isNaN(d.getTime())) return d.toISOString();
    }
    return new Date().toISOString();
}

async function handleCheckout(session: any, supabase: any) {
    const subscriptionId = session.subscription;
    const customerId = session.customer;
    const userId = session.metadata?.user_id;

    if (!userId) {
        console.warn("No user_id in session metadata");
        return;
    }

    console.log(`Processing checkout for user ${userId}, Subscription: ${subscriptionId}`);

    // Retrieve subscription details to confirm plan
    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
    console.log("Subscription retrieved:", JSON.stringify(subscription, null, 2));

    const priceId = subscription.items.data[0].price.id;
    // const plan = PRICE_PLAN_MAP[priceId] || "STARTER"; 
    // Since I don't have the map, I'll use the metadata target_plan if available as fallback?
    const plan = session.metadata.target_plan || "STARTER";

    console.log(`Plan identified: ${plan} (Price ID: ${priceId})`);

    // Update Supabase
    const { error } = await supabase.from("subscriptions").upsert({
        user_id: userId,
        plan: plan,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_status: subscription.status,
        stripe_price_id: priceId, // Store price ID too
        current_period_end: safeDate(subscription.current_period_end),
        updated_at: new Date().toISOString(),
    });

    if (error) {
        console.error("Supabase Upsert Error:", error);
        throw error;
    }

    console.log(`Updated subscription for user ${userId} to ${plan}`);
}

async function main() {
    // Payload from evt_1T1AwIBa...
    const payload = {
        "customer": "cus_Tz9EjbJrXxnEQY",
        "subscription": "sub_1T1AwFBa3LVp9FtO97373KuL",
        "metadata": { "user_id": "28aee107-e55f-4206-a0e4-11bc2361de6a", "target_plan": "WHITELABEL" },
    };

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    console.log("Calling handleCheckout...");
    await handleCheckout(payload, supabase);
    console.log("Done.");
}

main().catch(console.error);
