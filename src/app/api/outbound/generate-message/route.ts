
import { type NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
    generateLinkedInConnectMessage,
    generateLinkedInFollowupMessage,
    generateColdEmailMessage,
    generateFollowupEmail,
    Tone
} from "@/lib/outboundMessages";

interface GenerateMessageRequest {
    prospect_id: string;
    type: 'connect' | 'linkedin_followup' | 'email_initial' | 'email_followup';
    tone?: Tone;
}

export async function POST(req: NextRequest) {
    try {
        const body: GenerateMessageRequest = await req.json();
        const { prospect_id, type, tone = "DIRECT" } = body;

        if (!prospect_id || !type) {
            return new NextResponse("Missing prospect_id or type", { status: 400 });
        }

        const supabase = createServiceClient();

        // Fetch prospect details
        const { data: prospect, error } = await supabase
            .from("prospects")
            .select("*")
            .eq("id", prospect_id)
            .single();

        if (error || !prospect) {
            console.error("Prospect fetch error:", error);
            return new NextResponse("Prospect not found", { status: 404 });
        }

        // Fetch sender profile
        const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("user_id", prospect.owner_user_id)
            .single();

        const senderName = profile?.display_name || "Ken";

        const firstName = prospect.name.split(" ")[0] || prospect.name;
        const niche = prospect.niche || "";
        const company = prospect.company || "your agency";

        let message = "";
        const opts = { firstName, company, niche, senderName, tone };

        switch (type) {
            case 'connect':
                message = generateLinkedInConnectMessage(opts);
                break;
            case 'linkedin_followup':
                message = generateLinkedInFollowupMessage(opts);
                break;
            case 'email_initial':
                message = generateColdEmailMessage(opts);
                break;
            case 'email_followup':
                message = generateFollowupEmail(opts);
                break;
            default:
                return new NextResponse("Invalid message type", { status: 400 });
        }

        return NextResponse.json({ message });

    } catch (err: any) {
        console.error("Generate message error:", err.message);
        return new NextResponse(`Error: ${err.message}`, { status: 500 });
    }
}
