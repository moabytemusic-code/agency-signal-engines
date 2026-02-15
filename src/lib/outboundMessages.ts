
// Utility functions for generating outbound messages

export type Tone = "DIRECT" | "FRIENDLY" | "AUTHORITATIVE";

export interface MessageOptions {
    firstName: string;
    company?: string;
    niche?: string;
    senderName?: string;
    tone?: Tone;
}

const DEFAULT_SENDER = "Ken";

export function generateLinkedInConnectMessage(opts: MessageOptions): string {
    const { firstName, niche, tone = "DIRECT" } = opts;
    const n = niche ? ` for ${niche} clients` : "";

    if (tone === "FRIENDLY") {
        return `Hi ${firstName}, hope you're doing well! I run a performance backend helping agencies with live profit modeling${n}. Saw we operate in similar circles and wanted to connect.`;
    }
    if (tone === "AUTHORITATIVE") {
        return `Hi ${firstName}, we build infrastructure for high-scale agencies to model profit live${n}. Connecting with other serious operators in the space.`;
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
    const { firstName, company, niche, tone = "DIRECT", senderName = DEFAULT_SENDER } = opts;
    const n = niche || "your niche";
    const c = company || "your agency";

    if (tone === "FRIENDLY") {
        return `Subject: Profit modeling for ${c}

Hi ${firstName},

Hope you're having a great week. I noticed ${c} is doing great work in ${n}.

Most agencies still guess profitability during sales calls. We built a backend engine that models live ROAS and break-even targets in real-time. It really helps performance agencies close larger deals by proving the math instantly.

Worth a quick 5-min peek?

Best,
${senderName}`;
    }

    if (tone === "AUTHORITATIVE") {
        return `Subject: Regarding profit models at ${c}

${firstName},

I'm seeing ${c} scale in ${n}. 

Manual profitability guessing on sales calls kills deal velocity. We deployed a backend engine that models live ROAS, break-even targets, and risk ratings in real-time. Use this to close larger deals by proving the math.

If you want to see the protocol, let me know.

Regards,
${senderName}`;
    }

    // DIRECT
    return `Subject: Profit modeling for ${c}

Hi ${firstName},

I noticed ${c} is scaling ${n} campaigns. 

Most agencies guess profitability during sales calls. We built a backend engine that models live ROAS, break-even targets, and risk ratings in real-time.

It helps performance agencies close larger deals by proving math instantly.

Worth a 5-min peek?

Best,
${senderName}`;
}

export function generateFollowupEmail(opts: MessageOptions): string {
    const { firstName, tone = "DIRECT", senderName = DEFAULT_SENDER } = opts;

    if (tone === "FRIENDLY") {
        return `Hi ${firstName},

Just checking back on this! 

If you're tired of manual spreadsheets for client forecasting, our tool automates the whole "profitability" conversation.

Here's a 30s demo link if you're curious: [Link]

Cheers,
${senderName}`;
    }

    if (tone === "AUTHORITATIVE") {
        return `${firstName},

Circling back.

Manual spreadsheets for client forecasting are inefficient. Our tool automates the entire "profitability" conversation pre-launch.

30s protocol demo here: [Link]

Regards,
${senderName}`;
    }

    // DIRECT
    return `Hi ${firstName},

Checking back on this. 

If you're tired of manual spreadsheets for client forecasting, our tool automates the entire "profitability" conversation before you even launch ads.

Here's the 30s demo link if you're curious: [Link]

Best,
${senderName}`;
}
