
import { POST } from "../src/app/api/stripe/webhook/route"; // Import the handler
import { NextRequest } from "next/server";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
});

async function main() {
    // The payload from the failed event
    const payload = {
        "id": "evt_1T1AwIBa3LVp9FtOgdtbJ6g1",
        "object": "event",
        "api_version": "2019-12-03",
        "created": 1771183506,
        "data": {
            "object": {
                "id": "cs_test_b18qg6bJLVzumLGwAn5qQ4h5QlPujy4lSkyjfLlkxF40ewugkxPe7wjoxu",
                "object": "checkout.session",
                "adaptive_pricing": { "enabled": true },
                "after_expiration": null,
                "allow_promotion_codes": true,
                "amount_subtotal": 24900,
                "amount_total": 24900,
                "automatic_tax": { "enabled": false, "liability": null, "provider": null, "status": null },
                "billing_address_collection": null,
                "branding_settings": { "background_color": "#ffffff", "border_style": "rounded", "button_color": "#0074d4", "display_name": "Smart Hustler Marketing LLc.", "font_family": "default", "icon": null, "logo": null },
                "cancel_url": "https://agency.signalengines.com/pricing?checkout=canceled",
                "client_reference_id": null,
                "client_secret": null,
                "collected_information": { "business_name": null, "individual_name": null, "shipping_details": null },
                "consent": null,
                "consent_collection": null,
                "created": 1771183470,
                "currency": "usd",
                "currency_conversion": null,
                "custom_fields": [],
                "custom_text": { "after_submit": null, "shipping_address": null, "submit": null, "terms_of_service_acceptance": null },
                "customer": "cus_Tz9EjbJrXxnEQY",
                "customer_account": null,
                "customer_creation": "always",
                "customer_details": { "address": { "city": null, "country": "US", "line1": null, "line2": null, "postal_code": "43432", "state": null }, "business_name": null, "email": "ken_davis@msn.com", "individual_name": null, "name": "tester", "phone": null, "tax_exempt": "none", "tax_ids": [] },
                "customer_email": "ken_davis@msn.com",
                "discounts": [],
                "expires_at": 1771269869,
                "invoice": "in_1T1AwDBa3LVp9FtOH3pEHjUy",
                "invoice_creation": null,
                "livemode": false,
                "locale": null,
                "metadata": { "user_id": "28aee107-e55f-4206-a0e4-11bc2361de6a", "target_plan": "WHITELABEL" },
                "mode": "subscription",
                "origin_context": null,
                "payment_intent": null,
                "payment_link": null,
                "payment_method_collection": "always",
                "payment_method_configuration_details": null,
                "payment_method_options": { "card": { "request_three_d_secure": "automatic" } },
                "payment_method_types": ["card"],
                "payment_status": "paid",
                "permissions": null,
                "phone_number_collection": { "enabled": false },
                "recovered_from": null,
                "saved_payment_method_options": { "allow_redisplay_filters": ["always"], "payment_method_remove": "disabled", "payment_method_save": null },
                "setup_intent": null,
                "shipping": null,
                "shipping_address_collection": null,
                "shipping_options": [],
                "shipping_rate": null,
                "status": "complete",
                "submit_type": null,
                "subscription": "sub_1T1AwFBa3LVp9FtO97373KuL",
                "success_url": "https://agency.signalengines.com/dashboard?checkout=success",
                "total_details": { "amount_discount": 0, "amount_shipping": 0, "amount_tax": 0 },
                "ui_mode": "hosted",
                "url": null,
                "wallet_options": null
            }
        },
        "livemode": false,
        "pending_webhooks": 1,
        "request": { "id": null, "idempotency_key": null },
        "type": "checkout.session.completed"
    };

    const payloadString = JSON.stringify(payload, null, 2);

    // Generate signature locally
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");

    const signature = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret,
    });

    // Mock NextRequest
    const req = new NextRequest("http://localhost:3000/api/stripe/webhook", {
        method: "POST",
        headers: {
            "stripe-signature": signature,
            "content-type": "application/json",
        },
        body: payloadString,
    });

    console.log("Sending request...");
    try {
        const res = await POST(req);
        console.log("Response status:", res.status);
        const text = await res.text();
        console.log("Response body:", text);
    } catch (e) {
        console.error("Handler threw:", e);
    }
}

main().catch(console.error);
