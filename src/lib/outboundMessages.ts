
// Utility functions for generating outbound messages

export type Tone = "DIRECT" | "FRIENDLY" | "AUTHORITATIVE";

export interface MessageOptions {
    firstName: string;
    company?: string;
    niche?: string;
    senderName?: string;
    senderCompany?: string;
    tone?: Tone;
    platform?: string; // META, GOOGLE, TIKTOK, MIXED
}

const DEFAULT_SENDER = "Ken";
const DEFAULT_COMPANY = "Agency SignalEngines";

function getSignature(name?: string, company?: string): string {
    const n = name || DEFAULT_SENDER;
    const c = company || "";  // Only show company if provided
    if (c) return `${n}\n${c}`;
    return n;
}

export function generateLinkedInConnectMessage(opts: MessageOptions): string {
    const { firstName, niche, tone = "DIRECT", platform = "paid campaigns" } = opts;
    const n = niche ? ` for ${niche} clients` : "";
    const p = platform !== "MIXED" ? platform : "paid campaigns";

    if (tone === "FRIENDLY") {
        return `Hi ${firstName}, hope you're doing well! I run a backend helping agencies with live profit modeling${n}. Saw we operate in similar circles (scaling ${p}) and wanted to connect.`;
    }
    if (tone === "AUTHORITATIVE") {
        return `Hi ${firstName}, we build infrastructure for high-scale agencies to model profit live${n}. Connecting with other serious operators in the ${p} space.`;
    }
    // DIRECT
    return `Hi ${firstName}, I run a performance infrastructure backend that helps agencies handle live profit modeling${n}. Saw we're in similar circles—thought I'd connect. (No pitch).`;
}

export function generateLinkedInFollowupMessage(opts: MessageOptions): string {
    const { firstName, tone = "DIRECT" } = opts;

    if (tone === "FRIENDLY") {
        return `Hey ${firstName}, quick question—do you guys model break-even ROAS live on calls? Our tool handles it instantly to help close deals. Happy to share a demo if interested!`;
    }
    if (tone === "AUTHORITATIVE") {
        return `${firstName}—are you modeling live break-even ROAS on sales calls? Our engine automates this risk assessment. Let me know if you want to see the protocol.`;
    }
    // DIRECT
    return `Hey ${firstName}, quick question—do you currently model break-even ROAS live on sales calls? We built a tool that does this instantly to close more deals. Happy to send a 30s demo if relevant.`;
}

export function generateColdEmailMessage(opts: MessageOptions): string {
    const { firstName, company, niche, tone = "DIRECT", senderName = DEFAULT_SENDER, senderCompany, platform = "paid campaigns" } = opts;
    const n = niche || "your niche";
    const c = company || "your agency";
    const p = platform !== "MIXED" ? platform : "paid campaigns";
    const signature = getSignature(senderName, senderCompany);

    if (tone === "FRIENDLY") {
        return `Subject: Profit modeling for ${c}

Hi ${firstName},

Hope you're having a great week. I noticed ${c} is doing great work in ${n}.

Most agencies still guess profitability during sales calls. We built a backend engine that models live ROAS and break-even targets in real-time. It really helps performance agencies close larger deals by proving the math instantly.

Worth a quick 5-min peek?

Best,
${signature}`;
    }

    if (tone === "AUTHORITATIVE") {
        return `Subject: Regarding profit models at ${c}

${firstName},

I'm seeing ${c} scale in ${n}. 

Manual profitability guessing on sales calls kills deal velocity. We deployed a backend engine that models live ROAS, break-even targets, and risk ratings in real-time. Use this to close larger deals by proving the math.

If you want to see the protocol, let me know.

Regards,
${signature}`;
    }

    // DIRECT
    return `Subject: Profit modeling for ${c}

Hi ${firstName},

I noticed ${c} is scaling ${n} via ${p}. 

Most agencies guess profitability during sales calls. We built a backend engine that models live ROAS, break-even targets, and risk ratings in real-time.

It helps performance agencies close larger deals by proving math instantly.

Worth a 5-min peek?

Best,
${signature}`;
}

export function generateFollowupEmail(opts: MessageOptions): string {
    const { firstName, tone = "DIRECT", senderName = DEFAULT_SENDER, senderCompany } = opts;
    const signature = getSignature(senderName, senderCompany);

    if (tone === "FRIENDLY") {
        return `Hi ${firstName},

Just checking back on this! 

If you're tired of manual spreadsheets for client forecasting, our tool automates the whole "profitability" conversation.

Here's a 30s demo link if you're curious: [Link]

Cheers,
${signature}`;
    }

    if (tone === "AUTHORITATIVE") {
        return `${firstName},

Circling back.

Manual spreadsheets for client forecasting are inefficient. Our tool automates the entire "profitability" conversation pre-launch.

30s protocol demo here: [Link]

Regards,
${signature}`;
    }

    // DIRECT
    return `Hi ${firstName},

Checking back on this. 

If you're tired of manual spreadsheets for client forecasting, our tool automates the entire "profitability" conversation before you even launch ads.

Here's the 30s demo link if you're curious: [Link]

Best,
${signature}`;
}
