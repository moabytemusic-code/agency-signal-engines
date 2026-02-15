
import { type NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
    generateLinkedInConnectMessage,
    generateLinkedInFollowupMessage,
    generateColdEmailMessage,
    generateFollowupEmail
} from "@/lib/outboundMessages";

// Type definition for POST request body
interface GenerateMessageRequest {
    prospect_id: string;
    type: 'connect' | 'linkedin_followup' | 'email_initial' | 'email_followup';
}

export async function POST(req: NextRequest) {
    try {
        const body: GenerateMessageRequest = await req.json();
        const { prospect_id, type } = body;

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

        const firstName = prospect.name.split(" ")[0] || prospect.name;
        const niche = prospect.niche || "";
        const company = prospect.company || "your agency";

        let message = "";

        switch (type) {
            case 'connect':
                message = generateLinkedInConnectMessage(niche, firstName);
                break;
            case 'linkedin_followup':
                message = generateLinkedInFollowupMessage(niche, firstName);
                break;
            case 'email_initial':
                message = generateColdEmailMessage(niche, firstName, company);
                break;
            case 'email_followup':
                message = generateFollowupEmail(niche, firstName);
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
