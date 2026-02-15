import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get stripe_customer_id from DB
        const serviceClient = createServiceClient();
        const { data: subscription } = await serviceClient
            .from("subscriptions")
            .select("stripe_customer_id")
            .eq("user_id", user.id)
            .single();

        if (!subscription?.stripe_customer_id) {
            return new NextResponse("No billing account found", { status: 400 });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: subscription.stripe_customer_id,
            return_url: `${req.nextUrl.origin}/dashboard`,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error("STRIPE PORTAL ERROR:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
