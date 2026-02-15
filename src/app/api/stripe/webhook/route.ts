import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICE_PLAN_MAP } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";

// Note: App Router uses req.text() so we don't need bodyParser config

export async function POST(req: NextRequest) {
    const signature = req.headers.get("stripe-signature");
    const rawBody = await req.text();

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

    const supabase = createServiceClient();

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
    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
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
    const priceId = subscription.items.data[0]?.price.id;

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
    const subscriptionId = invoice.subscription;
    if (!subscriptionId) return;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
    await handleSubscriptionUpdate(subscription, supabase, 'customer.subscription.updated');
}

async function handleInvoiceFailed(invoice: any, supabase: any) {
    const subscriptionId = invoice.subscription;
    if (!subscriptionId) return;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
    await handleSubscriptionUpdate(subscription, supabase, 'customer.subscription.updated');
}
