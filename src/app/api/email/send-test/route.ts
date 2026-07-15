import { NextResponse } from "next/server";
import type { CampaignTemplateContent } from "@/lib/email-content";
import { renderCampaignHtml } from "@/lib/email-renderer";
import type { CampaignVariables } from "@/lib/email-variables";
import { claimIdempotencyKey, consumeRateLimit } from "@/lib/request-guards";
import { getResendClient, getResendConfig } from "@/lib/resend";

function getClientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  try {
    const address = getClientAddress(request);
    const limit = consumeRateLimit(`send-test:${address}`);

    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans une minute." },
        { status: 429 },
      );
    }

    const body = (await request.json()) as {
      campaignId?: string;
      variables?: Partial<CampaignVariables>;
      content?: CampaignTemplateContent;
      testEmail?: string;
      idempotencyKey?: string;
    };

    const { campaignId, variables, content } = body;
    if (!campaignId) {
      return NextResponse.json({ error: "Campaign id is required." }, { status: 400 });
    }

    const idempotencyKey = body.idempotencyKey?.trim();
    if (idempotencyKey && !claimIdempotencyKey(`test:${idempotencyKey}`)) {
      return NextResponse.json(
        { error: "Ce test a déjà été traité. Rafraîchissez avant de réessayer." },
        { status: 409 },
      );
    }

    const resend = getResendClient();
    if (!resend) {
      return NextResponse.json(
        {
          error: "Missing RESEND_API_KEY. Add it to your environment before sending a test.",
        },
        { status: 500 },
      );
    }

    const { from, testEmail, replyTo, allowedTestEmails } = getResendConfig();
    const targetTestEmail = (body.testEmail ?? testEmail).trim().toLowerCase();

    if (!allowedTestEmails.has(targetTestEmail)) {
      return NextResponse.json(
        {
          error:
            "Adresse de test non autorisée. Ajoutez-la dans RESEND_ALLOWED_TEST_EMAILS.",
        },
        { status: 403 },
      );
    }

    const rendered = await renderCampaignHtml(campaignId, variables, content);

    const result = await resend.emails.send({
      from,
      to: [targetTestEmail],
      subject: `[TEST] ${rendered.subject}`,
      html: rendered.html,
      text: rendered.text,
      replyTo,
    });

    return NextResponse.json({
      ok: true,
      message: `Test email queued for ${targetTestEmail}.`,
      id: result.data?.id ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to send test email.",
      },
      { status: 500 },
    );
  }
}
