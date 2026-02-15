
// Utility functions for generating outbound messages

export function generateLinkedInConnectMessage(niche: string, firstName: string): string {
    const n = niche ? ` for ${niche} clients` : "";
    return `Hi ${firstName}, I run a performance infrastructure backend that helps agencies handle live profit modeling${n}. Saw we're in similar circles—thought I'd connect. (No pitch).`;
}

export function generateLinkedInFollowupMessage(niche: string, firstName: string): string {
    return `Hey ${firstName}, quick question—do you currently model break-even ROAS live on sales calls? We built a tool that does this instantly to close more deals. Happy to send a 30s demo if relevant.`;
}

export function generateColdEmailMessage(niche: string, firstName: string, company: string): string {
    const n = niche || "your niche";
    return `Subject: Profit modeling for ${company}

Hi ${firstName},

I noticed ${company} is scaling ${n} campaigns. 

Most agencies guess profitability during sales calls. We built a backend engine that models live ROAS, break-even targets, and risk ratings in real-time.

It helps performance agencies close larger deals by proving math instantly.

Worth a 5-min peek?

Best,
[Your Name]`;
}

export function generateFollowupEmail(niche: string, firstName: string): string {
    return `Hi ${firstName},

Checking back on this. 

If you're tired of manual spreadsheets for client forecasting, our tool automates the entire "profitability" conversation before you even launch ads.

Here's the 30s demo link if you're curious: [Link]

Best,
[Your Name]`;
}
