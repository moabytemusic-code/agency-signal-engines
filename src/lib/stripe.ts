import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing. Please set it in your .env.local file.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-01-27.acacia', // Or your account's default version
    typescript: true,
});

// IMPORTANT: Replace these with your actual Stripe Price IDs!
// Go to Stripe Dashboard -> Products -> Specific Product -> Copy Price ID (starts with "price_...")
export const PLAN_PRICE_MAP = {
    STARTER: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || "price_H5ggYJDqQfDlbE",
    GROWTH: process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH || "price_H5ggYJDqQfDlbF",
    WHITELABEL: process.env.NEXT_PUBLIC_STRIPE_PRICE_WHITELABEL || "price_H5ggYJDqQfDlbG"
};

export const PRICE_PLAN_MAP = Object.entries(PLAN_PRICE_MAP).reduce((acc, [plan, priceId]) => {
    acc[priceId] = plan;
    return acc;
}, {} as Record<string, string>);
