import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICE_PLAN_MAP, PLAN_PRICE_MAP } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/service"; // Service client for all DB ops

// Stripe needs raw body for signature verification
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    const signature = req.headers.get("stripe-signature");
    const rawBody = await req.text(); // Next.js App Router gives raw body via .text()

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return new NextResponse("Missing signature or secret", { status: 400 });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error("Webhook signature verification failed.", err.message);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabase = createClient(); // Actually the SERVICE client from lib/supabase/service

    // 1. Idempotency Check
    const { data: existingEvent } = await supabase
        .from("stripe_events")
        .select("event_id")
        .eq("event_id", event.id)
        .single();

    if (existingEvent) {
        console.log(`Event ${event.id} already processed. Skipping.`);
        return NextResponse.json({ received: true, duplicate: true });
    }

    // 2. Log Event
    await supabase.from("stripe_events").insert({
        event_id: event.id,
        type: event.type,
    });

    const session = event.data.object as any;

    try {
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckout(session, supabase);
                break;
            case "customer.subscription.updated":
            case "customer.subscription.deleted":
                await handleSubscriptionUpdate(session, supabase, event.type);
                break;
            case "invoice.payment_succeeded":
                await handleInvoicePaid(session, supabase);
                break;
            case "invoice.payment_failed":
                await handleInvoiceFailed(session, supabase);
                break;
            default:
            // Unhandled event type
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error(`Webhook processing error (${event.type}):`, error.message);
        return new NextResponse("Webhook handler failed", { status: 500 });
    }
}

// Handler Functions

async function handleCheckout(session: any, supabase: any) {
    const subscriptionId = session.subscription;
    const customerId = session.customer;
    const userId = session.metadata?.user_id;

    if (!userId) {
        console.warn("No user_id in session metadata");
        return;
    }

    // Retrieve subscription details to confirm plan
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;
    const plan = PRICE_PLAN_MAP[priceId] || "STARTER"; // Default or map lookup

    // Update Supabase
    await supabase.from("subscriptions").upsert({
        user_id: userId,
        plan: plan,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_status: subscription.status,
        stripe_price_id: priceId, // Store price ID too
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
    });

    console.log(`Updated subscription for user ${userId} to ${plan}`);
}

async function handleSubscriptionUpdate(subscription: any, supabase: any, type: string) {
    const customerId = subscription.customer;
    const status = subscription.status; // active, past_due, canceled, incomplete
    const priceId = subscription.items.data[0]?.price.id; // Could be missing if fully deleted?

    // Find user by stripe_customer_id
    const { data: userSub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .single();

    if (!userSub) {
        console.warn(`No user found for customer ${customerId}`);
        return;
    }

    if (type === "customer.subscription.deleted" || status === "canceled") {
        await supabase.from("subscriptions").update({
            plan: "FREE",
            stripe_status: "canceled",
            updated_at: new Date().toISOString(),
        }).eq("user_id", userSub.user_id);
        console.log(`Canceled subscription for user ${userSub.user_id}`);
        return;
    }

    // Update Plan + Status
    const plan = PRICE_PLAN_MAP[priceId || ""] || "FREE";
    // Only set plan if active/trialing. If past_due, keep plan but mark status (app logic handles restriction)
    // Actually, user requested strict enforcement.
    const effectivePlan = (status === "active" || status === "trialing") ? plan : "FREE";

    await supabase.from("subscriptions").update({
        plan: effectivePlan,
        stripe_status: status,
        stripe_price_id: priceId,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
    }).eq("user_id", userSub.user_id);

    console.log(`Updated subscription status for user ${userSub.user_id} to ${status} (Plan: ${effectivePlan})`);
}

async function handleInvoicePaid(invoice: any, supabase: any) {
    // If subscription invoice paid successfully, ensure status is active
    /*
      In 'invoice.payment_succeeded', the object IS the invoice.
      This event usually fires for recurring payments.
      We can use it to re-activate a past_due subscription if needed, 
      although 'customer.subscription.updated' usually handles status changes too.
      We'll just log or double-confirm status here.
    */
    const subscriptionId = invoice.subscription;
    if (!subscriptionId) return;

    // Optionally fetch latest sub status to confirm
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await handleSubscriptionUpdate(subscription, supabase, 'customer.subscription.updated');
}

async function handleInvoiceFailed(invoice: any, supabase: any) {
    const subscriptionId = invoice.subscription;
    if (!subscriptionId) return;

    // Subscription status likely changed to past_due contentiously
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await handleSubscriptionUpdate(subscription, supabase, 'customer.subscription.updated');
}
