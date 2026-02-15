import { LocalSeoInput, LocalSeoResult, PillarPage, SupportingPage, FaqItem, InternalLink } from "./types";

export function validateLocalSeoInput(input: any): {
    ok: boolean;
    fields?: Record<string, string>;
    sanitized?: Required<LocalSeoInput>;
} {
    const fields: Record<string, string> = {};
    const sanitized: Partial<Required<LocalSeoInput>> = {};

    // city
    if (!input.city || typeof input.city !== "string" || input.city.trim() === "") {
        fields.city = "Required non-empty string";
    } else {
        sanitized.city = input.city.trim();
    }

    // service
    if (!input.service || typeof input.service !== "string" || input.service.trim() === "") {
        fields.service = "Required non-empty string";
    } else {
        sanitized.service = input.service.trim();
    }

    // audience (optional)
    if (input.audience && typeof input.audience === "string") {
        sanitized.audience = input.audience.trim();
    } else {
        sanitized.audience = "";
    }

    // radius_miles (default 25)
    if (input.radius_miles === undefined || input.radius_miles === null) {
        sanitized.radius_miles = 25;
    } else if (typeof input.radius_miles !== "number" || input.radius_miles <= 0) {
        fields.radius_miles = "Must be a number > 0";
    } else {
        sanitized.radius_miles = input.radius_miles;
    }

    // count (default 30, 15-75)
    if (input.count === undefined || input.count === null) {
        sanitized.count = 30;
    } else if (typeof input.count !== "number" || input.count < 15 || input.count > 75) {
        fields.count = "Must be between 15 and 75";
    } else {
        sanitized.count = input.count;
    }

    if (Object.keys(fields).length > 0) {
        return { ok: false, fields };
    }

    return { ok: true, sanitized: sanitized as Required<LocalSeoInput> };
}

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export function generateCluster(input: Required<LocalSeoInput>): LocalSeoResult {
    const { city, service, count } = input;
    const cleanCity = city;
    const cleanService = service;

    // 1. Pillar Page
    const pillarSlug = slugify(`${cleanService}-in-${cleanCity}`);
    const pillar: PillarPage = {
        title: `${cleanService} in ${cleanCity} | Quotes, Pricing & What to Expect`,
        slug: pillarSlug,
        intent: "COMMERCIAL",
        outline: [
            `${cleanService} Overview in ${cleanCity}`,
            "Pricing Factors & Timelines",
            "Common Problems & Solutions",
            `Why Choose a Local ${cleanService} Provider`,
            "Get a Quote / Next Steps"
        ]
    };

    // 2. Supporting Pages
    // Target 60% commercial, 40% informational
    const commercialCount = Math.round(count * 0.6);
    const infoCount = count - commercialCount;

    const pages: SupportingPage[] = [];

    const commTemplates = [
        "Best {service} in {city}: How to Choose",
        "{service} Cost in {city}: Real Pricing Factors",
        "Same-Day {service} in {city}: When It Makes Sense",
        "Emergency {service} in {city}: What to Do First",
        "{service} Quotes in {city}: What’s Included",
        "Affordable {service} in {city}: Top Options",
        "Local {service} Experts in {city}",
        "Residential {service} Services in {city}",
        "Commercial {service} Solutions in {city}",
        "Top Rated {service} Company in {city}"
    ];

    const infoTemplates = [
        "How Often Should You Get {service} in {city}?",
        "{service} Checklist for {city} Homeowners",
        "Top {service} Mistakes to Avoid in {city}",
        "Permits & Rules for {service} in {city} (What to Ask)",
        "DIY vs Professional {service} in {city}",
        "Signs You Need {service} in {city} Immediately",
        "How to Prepare for {service} in {city}",
        "The History of {service} in {city}",
        "Eco-Friendly {service} Options in {city}",
        "Seasonal {service} Maintenance in {city}"
    ];

    // Generate Commercial Pages
    for (let i = 0; i < commercialCount; i++) {
        const template = commTemplates[i % commTemplates.length];
        const title = template.replace("{service}", cleanService).replace("{city}", cleanCity);
        // Vary modifiers for keyword: Cost, Emergency, Best, etc.
        const modifier = template.split(" ")[0].toLowerCase().replace("{service}", cleanService);
        // Simple heuristic for modifier

        pages.push({
            title,
            slug: slugify(title),
            intent: "COMMERCIAL",
            primary_keyword: `${cleanService} ${cleanCity} ${modifier.includes(cleanService.toLowerCase()) ? "services" : modifier}`
        });
    }

    // Generate Informational Pages
    for (let i = 0; i < infoCount; i++) {
        const template = infoTemplates[i % infoTemplates.length];
        const title = template.replace("{service}", cleanService).replace("{city}", cleanCity);

        pages.push({
            title,
            slug: slugify(title),
            intent: "INFORMATIONAL",
            primary_keyword: `${cleanService} ${cleanCity} tips`
        });
    }

    // 3. FAQ Cluster
    const faqs: FaqItem[] = [
        {
            question: `How much does ${cleanService} cost in ${cleanCity}?`,
            short_answer: `The cost of ${cleanService} in ${cleanCity} depends on the scope of the project. On average, homeowners can expect to pay market rates, but it's best to get a specific quote.`
        },
        {
            question: `Are there emergency ${cleanService} services in ${cleanCity}?`,
            short_answer: `Yes, many providers offer emergency ${cleanService} in ${cleanCity} for urgent situations. Be sure to ask about after-hours fees.`
        },
        {
            question: `Do I need a permit for ${cleanService} in ${cleanCity}?`,
            short_answer: `Certain ${cleanService} jobs in ${cleanCity} may require a permit depending on local regulations. Your provider should handle this process.`
        },
        {
            question: `How do I find the best ${cleanService} in ${cleanCity}?`,
            short_answer: `Look for licensed and insured professionals with strong local reviews in ${cleanCity}. Checking recent work examples is also recommended.`
        },
        {
            question: `How long does ${cleanService} take in ${cleanCity}?`,
            short_answer: `Most standard ${cleanService} jobs in ${cleanCity} can be completed within a standard timeframe, though complex projects may take longer.`
        },
        {
            question: `Is ${cleanService} covered by insurance in ${cleanCity}?`,
            short_answer: `It depends on your policy and the cause of the issue. Many ${cleanCity} providers can help you document the damage for claims.`
        },
        {
            question: `What guarantees come with ${cleanService} in ${cleanCity}?`,
            short_answer: `Reputable ${cleanService} providers in ${cleanCity} usually offer a workmanship warranty. Always get this in writing before starting.`
        },
        {
            question: `Can I do ${cleanService} myself in ${cleanCity}?`,
            short_answer: `While minor maintenance is possible, professional ${cleanService} is recommended for safety and compliance with ${cleanCity} codes.`
        },
        {
            question: `What areas of ${cleanCity} do you serve?`,
            short_answer: `We provide ${cleanService} throughout ${cleanCity} and the surrounding neighborhoods within a ${input.radius_miles} mile radius.`
        },
        {
            question: `How soon can I book ${cleanService} in ${cleanCity}?`,
            short_answer: `Availability varies, but many ${cleanCity} ${cleanService} providers can schedule an inspection within 24-48 hours.`
        }
    ];

    // 4. Internal Link Map
    const links: InternalLink[] = [];

    // Pillar -> All Supporting
    pages.forEach(p => {
        links.push({
            from_slug: pillarSlug,
            to_slug: p.slug,
            anchor_text: `Learn more about ${p.intent === "COMMERCIAL" ? "our" : ""} ${p.title}`
        });
    });

    // Inter-supporting links (chaining for simplicity)
    // 10 extra links as requested
    for (let i = 0; i < 10; i++) {
        const from = pages[i % pages.length];
        const to = pages[(i + 1) % pages.length]; // circular link
        links.push({
            from_slug: from.slug,
            to_slug: to.slug,
            anchor_text: `See also: ${to.title}`
        });
    }

    return {
        pillar,
        supporting_pages: pages,
        faq_cluster: faqs,
        internal_link_map: links
    };
}
