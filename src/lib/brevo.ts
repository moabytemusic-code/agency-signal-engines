
// Brevo API Utility

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

interface SendEmailParams {
    to: string;
    subject: string;
    htmlContent: string;
}

export async function sendEmail({ to, subject, htmlContent }: SendEmailParams) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "ken@signalengines.com";

    if (!apiKey) {
        throw new Error("Missing BREVO_API_KEY");
    }

    const payload = {
        sender: { name: "Ken | SignalEngines", email: senderEmail },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
    };

    const res = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
            "api-key": apiKey,
            "Content-Type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Brevo API Error:", errorText);
        throw new Error(`Brevo API Failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data.messageId; // Brevo returns { messageId: "..." }
}
