import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PLAN_PRICE_MAP } from "@/lib/stripe";
import { getUserPlan } from "@/lib/billingUsage";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { plan } = body;

        const priceId = PLAN_PRICE_MAP[plan as keyof typeof PLAN_PRICE_MAP];

        if (!priceId) {
            return new NextResponse("Invalid plan", { status: 400 });
        }

        // Check for existing Stripe customer ID
        const { data: subscription } = await supabase
            .from("subscriptions")
            .select("stripe_customer_id")
            .eq("user_id", user.id)
            .single();

        const existingCustomerId = subscription?.stripe_customer_id;

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer: existingCustomerId || undefined, // Use existing if available
            customer_email: (!existingCustomerId && user.email) ? user.email : undefined, // Provide email for new
            metadata: {
                user_id: user.id,
                target_plan: plan,
            },
            subscription_data: {
                metadata: {
                    user_id: user.id,
                },
            },
            success_url: `${req.nextUrl.origin}/dashboard?checkout=success`,
            cancel_url: `${req.nextUrl.origin}/pricing?checkout=canceled`,
            allow_promotion_codes: true,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error("STRIPE CHECKOUT ERROR:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
