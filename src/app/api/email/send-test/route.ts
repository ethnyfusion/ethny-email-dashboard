import { NextResponse } from "next/server";
import type { CampaignTemplateContent } from "@/lib/email-content";
import { renderCampaignHtml } from "@/lib/email-renderer";
import { getResendClient, getResendConfig } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { campaignId, variables, content } = body as {
      campaignId?: string;
      variables?: Record<string, string>;
      content?: CampaignTemplateContent;
    };

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign id is required." }, { status: 400 });
    }

    const resend = getResendClient();
    const { from, testEmail } = getResendConfig();

    if (!resend) {
      return NextResponse.json(
        {
          error: "Missing RESEND_API_KEY. Add it to your environment before sending a test.",
        },
        { status: 500 },
      );
    }

    const rendered = await renderCampaignHtml(campaignId, variables, content);

    const result = await resend.emails.send({
      from,
      to: [testEmail],
      subject: rendered.subject,
      html: rendered.html,
    });

    return NextResponse.json({
      ok: true,
      message: `Test email queued for ${testEmail}.`,
      id: result.data?.id ?? null,
    });
  } catch (error) {
    console.error("send-test route error", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to send test email.",
      },
      { status: 500 },
    );
  }
}
