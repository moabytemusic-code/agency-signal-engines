import { AdScriptInput, AdAudience, AdOffer, AdStyle, AdScriptResult } from "./types";

export function validateAdScriptInput(input: any): {
    ok: boolean;
    fields?: Record<string, string>;
    sanitized?: AdScriptInput;
} {
    const fields: Record<string, string> = {};
    const sanitized: Partial<AdScriptInput> = {};

    // Platform
    const validPlatforms = ["TIKTOK", "REELS", "YOUTUBE_SHORTS", "META_FEED", "META_STORY"];
    if (!input.platform || !validPlatforms.includes(input.platform)) {
        fields.platform = `Must be one of: ${validPlatforms.join(", ")}`;
    } else {
        sanitized.platform = input.platform;
    }

    // Industry
    if (!input.industry || typeof input.industry !== "string" || input.industry.trim() === "") {
        fields.industry = "Required and must be non-empty";
    } else {
        sanitized.industry = input.industry.trim();
    }

    // Offer
    if (!input.offer || typeof input.offer !== "object") {
        fields.offer = "Missing offer object";
    } else {
        const offer: Partial<AdOffer> = {};
        const validTypes = ["LEAD_GEN", "ECOM", "APPOINTMENT", "WEBINAR", "SERVICE"];

        if (!input.offer.type || !validTypes.includes(input.offer.type)) {
            fields["offer.type"] = `Must be one of: ${validTypes.join(", ")}`;
        } else {
            offer.type = input.offer.type;
        }

        if (!input.offer.primary_benefit || typeof input.offer.primary_benefit !== "string") {
            fields["offer.primary_benefit"] = "Required string";
        } else {
            offer.primary_benefit = input.offer.primary_benefit.trim();
        }

        if (input.offer.proof && typeof input.offer.proof !== "string") {
            fields["offer.proof"] = "Must be a string";
        } else {
            offer.proof = input.offer.proof ? input.offer.proof.trim() : undefined;
        }

        if (!input.offer.cta || typeof input.offer.cta !== "string") {
            fields["offer.cta"] = "Required string";
        } else {
            offer.cta = input.offer.cta.trim();
        }

        sanitized.offer = offer as AdOffer;
    }

    // Audience
    if (!input.audience || typeof input.audience !== "object") {
        fields.audience = "Missing audience object";
    } else {
        const audience: Partial<AdAudience> = {};
        if (!input.audience.who || typeof input.audience.who !== "string") {
            fields["audience.who"] = "Required string";
        } else {
            audience.who = input.audience.who.trim();
        }

        if (!input.audience.pain || typeof input.audience.pain !== "string") {
            fields["audience.pain"] = "Required string";
        } else {
            audience.pain = input.audience.pain.trim();
        }

        if (!input.audience.objection || typeof input.audience.objection !== "string") {
            fields["audience.objection"] = "Required string";
        } else {
            audience.objection = input.audience.objection.trim();
        }
        sanitized.audience = audience as AdAudience;
    }

    // Style
    if (!input.style || typeof input.style !== "object") {
        fields.style = "Missing style object";
    } else {
        const style: Partial<AdStyle> = {};
        const validTones = ["DIRECT", "FRIENDLY", "AUTHORITATIVE", "URGENT"];
        if (!input.style.tone || !validTones.includes(input.style.tone)) {
            fields["style.tone"] = `Must be one of: ${validTones.join(", ")}`;
        } else {
            style.tone = input.style.tone;
        }

        const validLengths = [15, 30, 45];
        if (!input.style.length_sec || !validLengths.includes(input.style.length_sec)) {
            fields["style.length_sec"] = "Must be 15, 30, or 45";
        } else {
            style.length_sec = input.style.length_sec;
        }
        sanitized.style = style as AdStyle;
    }

    if (Object.keys(fields).length > 0) {
        return { ok: false, fields };
    }

    return { ok: true, sanitized: sanitized as AdScriptInput };
}

export function buildPrompt(input: AdScriptInput): string {
    return `
SYSTEM: You are a direct-response ad script generator for agencies.
- Return ONLY JSON matching schema.
- No guarantees, no prohibited claims, no “get rich quick”, no medical promises.
- Keep hooks punchy and specific.
- Scripts must roughly match length_sec.
- If proof missing, write proof-neutral lines (e.g., “Trusted by local customers”) without inventing numbers.
- compliance_notes: 1–3 items max.

INPUT:
Platform: ${input.platform}
Industry: ${input.industry}
Offer Type: ${input.offer.type}
Primary Benefit: ${input.offer.primary_benefit}
Proof: ${input.offer.proof || "None provided"}
CTA: ${input.offer.cta}
Audience: ${input.audience.who}
Pain: ${input.audience.pain}
Objection: ${input.audience.objection}
Tone: ${input.style.tone}
Length: ${input.style.length_sec}s

OUTPUT SCHEMA (JSON Only):
{
  "hooks": [
    { "id": "H1", "text": "Hook 1 text" },
    ...5 hooks total...
  ],
  "scripts": [
    {
      "id": "S1",
      "structure": { "hook_id": "H1", "beats": ["HOOK","PAIN","PROMISE","PROOF","CTA"] },
      "voiceover": "Script text...",
      "on_screen_text": ["Overlay 1", "Overlay 2", "Overlay 3"],
      "broll_shots": ["Visual description 1", "Visual description 2", "Visual description 3"],
      "cta": "Final call to action"
    },
    {
      "id": "S2",
      "structure": { "hook_id": "H2", "beats": ["HOOK","PAIN","MECHANISM","OBJECTION","CTA"] },
      "voiceover": "Script text...",
      "on_screen_text": ["Overlay 1", "Overlay 2", "Overlay 3"],
      "broll_shots": ["Visual description 1", "Visual description 2", "Visual description 3"],
      "cta": "Final call to action"
    }
  ],
  "objection_rebuttals": [
    { "objection": "${input.audience.objection}", "response": "Rebuttal text" }
  ],
  "compliance_notes": ["Note 1"]
}
`.trim();
}

// Mock function to simulate AI generation
// In production, this would call OpenAI/Anthropic with the prompt above.
export async function generateMockAdScript(input: AdScriptInput): Promise<AdScriptResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const safeProof = input.offer.proof || "Trusted by many happy customers";

    return {
        hooks: [
            { id: "H1", text: `Stop struggling with ${input.audience.pain}.` },
            { id: "H2", text: `The secret to ${input.offer.primary_benefit} revealed.` },
            { id: "H3", text: `${input.audience.who}: You need to see this.` },
            { id: "H4", text: `Why everything you know about ${input.industry} is wrong.` },
            { id: "H5", text: `How to finally fix ${input.audience.pain} today.` }
        ],
        scripts: [
            {
                id: "S1",
                structure: { hook_id: "H1", beats: ["HOOK", "PAIN", "PROMISE", "PROOF", "CTA"] },
                voiceover: `(H1: Stop struggling with ${input.audience.pain}.) I know it feels impossible, but ${input.offer.primary_benefit} is easier than you think. using our proven method. ${safeProof}. Don't wait another day. ${input.offer.cta}.`,
                on_screen_text: [`Stop ${input.audience.pain}`, `${input.offer.primary_benefit}`, `${input.offer.cta}`],
                broll_shots: [`Person looking frustrated with ${input.audience.pain}`, `Smiling person enjoying ${input.offer.primary_benefit}`, `Logo and CTA card`],
                cta: input.offer.cta
            },
            {
                id: "S2",
                structure: { hook_id: "H2", beats: ["HOOK", "PAIN", "MECHANISM", "OBJECTION", "CTA"] },
                voiceover: `(H2: The secret to ${input.offer.primary_benefit} revealed.) You've probably heard that ${input.audience.objection}. But that's not true. We help ${input.audience.who} achieve success. ${input.offer.cta} now to learn more!`,
                on_screen_text: [`Secret Revealed`, `Not what you think`, `${input.offer.cta}`],
                broll_shots: [`Confused person looking at phone`, `Person having a realization`, `Finger tapping call to action button`],
                cta: input.offer.cta
            }
        ],
        objection_rebuttals: [
            {
                objection: input.audience.objection,
                response: `That's a common concern, but actually ${input.offer.primary_benefit} handles this by...`
            }
        ],
        compliance_notes: [
            "Ensure all claims are verified before publishing.",
            "If this is a health product, add necessary disclaimers."
        ]
    };
}
