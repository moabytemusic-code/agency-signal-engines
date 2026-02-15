
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendEmail } from "@/lib/brevo";
import {
    generateColdEmailMessage,
    generateFollowupEmail,
    Tone
} from "@/lib/outboundMessages";
import { getPeriodYYYYMM, getUserPlan, getOrCreateMonthlyUsage, incrementUsage } from "@/lib/billingUsage";
import { getPlanLimits } from "@/lib/plans";

interface SendEmailRequest {
    prospect_id: string;
    type: 'email_initial' | 'email_followup';
    tone?: Tone;
}

export async function POST(req: NextRequest) {
    try {
        const body: SendEmailRequest = await req.json();
        const { prospect_id, type, tone = "DIRECT" } = body;

        if (!prospect_id || !type) {
            return new NextResponse("Missing prospect_id or type", { status: 400 });
        }

        const supabase = createServiceClient();

        // Fetch Prospect
        const { data: prospect, error } = await supabase
            .from("prospects")
            .select("*")
            .eq("id", prospect_id)
            .single();

        if (error || !prospect) {
            console.error("Prospect fetch error:", error);
            return new NextResponse("Prospect not found", { status: 404 });
        }

        const userId = prospect.owner_user_id;

        // Fetch Sender Profile
        const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("user_id", userId)
            .single();

        const senderName = profile?.display_name || "Ken";

        // --- METERING ENFORCEMENT ---
        const period = getPeriodYYYYMM();
        const plan = await getUserPlan(userId); // Checks subscription table
        const limits = getPlanLimits(plan);

        // Get current usage
        const usageRow = await getOrCreateMonthlyUsage(userId, period);
        const used = usageRow.outbound_email_used || 0;
        const limit = limits.outbound_email;

        if (used >= limit) {
            return NextResponse.json({
                error: "Monthly email limit exceeded",
                code: "LIMIT_EXCEEDED",
                limit,
                used,
                plan
            }, { status: 403 });
        }
        // ----------------------------

        const firstName = prospect.name.split(" ")[0] || "there";
        const company = prospect.company || "your agency";
        const niche = prospect.niche || "";

        // Generate Content
        let subject = "";
        let bodyText = "";
        const opts = { firstName, company, niche, senderName, tone };

        if (type === 'email_initial') {
            subject = "Quick ROI question";
            bodyText = generateColdEmailMessage(opts);
        } else if (type === 'email_followup') {
            subject = "Re: Quick ROI question";
            bodyText = generateFollowupEmail(opts);
        } else {
            return new NextResponse("Invalid email type", { status: 400 });
        }

        // Clean up bodyText (remove Subject line if present)
        if (bodyText.startsWith("Subject:")) {
            const lines = bodyText.split("\n");
            // The Subject line is usually the first line. 
            // In generateColdEmailMessage, 'Subject: ... \n\nHi...'
            // We extract subject if it's there, but we hardcoded subject above for simplicity.
            // If the generator returns a specific subject, we might want to parse it.
            // For now, let's just strip the subject line from body so it doesn't appear in email body.
            if (lines[0].startsWith("Subject:")) {
                // If it's a generated subject, maybe we should use it?
                // The current code hardcodes "Quick ROI question".
                // Let's stick to hardcoded or simple parsing.
                // Assuming standard format from our generator:
                subject = lines[0].replace("Subject: ", "").trim();
                bodyText = lines.slice(1).join("\n").trim();
            }
        }

        // Send Email via Brevo
        let messageId = null;
        try {
            messageId = await sendEmail({
                to: prospect.email,
                subject: subject,
                htmlContent: bodyText.replace(/\n/g, "<br>"),
            });
        } catch (emailErr: any) {
            console.error("Failed to send email via Brevo:", emailErr);
            return new NextResponse(`Email sending failed: ${emailErr.message}`, { status: 500 });
        }

        // --- INCREMENT USAGE (Atomic) ---
        await incrementUsage(userId, period, 'outbound_email').catch(err => {
            console.error("Failed to increment usage log:", err);
            // Don't fail the request, just log error
        });
        // --------------------------------

        // Update Prospect
        const now = new Date();
        const nextFollowUp = new Date();
        const daysToAdd = type === 'email_initial' ? 3 : 4;
        nextFollowUp.setDate(now.getDate() + daysToAdd);

        await supabase.from("prospects").update({
            status: 'messaged',
            last_contacted_at: now.toISOString(),
            followup_due_at: nextFollowUp.toISOString(),
        }).eq("id", prospect_id);

        // Log to outbound_logs
        await supabase.from("outbound_logs").insert({
            prospect_id: prospect_id,
            owner_user_id: userId,
            type: type,
            subject: subject,
            body: bodyText,
            brevo_message_id: messageId,
        });

        return NextResponse.json({ success: true, messageId });

    } catch (err: any) {
        console.error("Send email error:", err.message);
        return new NextResponse(`Error: ${err.message}`, { status: 500 });
    }
}
