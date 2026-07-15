import { NextResponse } from "next/server";
import type { CampaignTemplateContent } from "@/lib/email-content";
import { renderCampaignHtml } from "@/lib/email-renderer";
import type { CampaignVariables } from "@/lib/email-variables";
import { claimIdempotencyKey, consumeRateLimit } from "@/lib/request-guards";
import {
  assertFromEmailSupportsLiveSends,
  getResendClient,
  getResendConfig,
} from "@/lib/resend";

interface CampaignRecipient {
  email: string;
}

function getClientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

function normalizeRecipientEmails(recipients: CampaignRecipient[]) {
  const seen = new Set<string>();
  const valid: string[] = [];

  for (const recipient of recipients) {
    const email = recipient.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email)) {
      continue;
    }
    if (seen.has(email)) {
      continue;
    }
    seen.add(email);
    valid.push(email);
  }

  return valid;
}

export async function POST(request: Request) {
  try {
    const address = getClientAddress(request);
    const limit = consumeRateLimit(`send-campaign:${address}`);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives d’envoi. Réessayez dans une minute." },
        { status: 429 },
      );
    }

    const resend = getResendClient();
    if (!resend) {
      return NextResponse.json(
        { error: "Missing RESEND_API_KEY. Unable to send campaign." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as {
      campaignId?: string;
      variables?: Partial<CampaignVariables>;
      content?: CampaignTemplateContent;
      recipients?: CampaignRecipient[];
      confirmationText?: string;
      idempotencyKey?: string;
      sendToken?: string;
    };

    const campaignId = body.campaignId?.trim();
    if (!campaignId) {
      return NextResponse.json({ error: "Campaign id is required." }, { status: 400 });
    }

    const recipients = normalizeRecipientEmails(body.recipients ?? []);
    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No valid recipients selected for this campaign." },
        { status: 400 },
      );
    }

    const expectedConfirmation = `ENVOYER ${recipients.length}`;
    if (body.confirmationText?.trim().toUpperCase() !== expectedConfirmation) {
      return NextResponse.json(
        {
          error: `Confirmation invalide. Tapez exactement "${expectedConfirmation}" pour confirmer l’envoi.`,
        },
        { status: 400 },
      );
    }

    const idempotencyKey = body.idempotencyKey?.trim();
    if (!idempotencyKey) {
      return NextResponse.json(
        { error: "idempotencyKey is required for campaign sends." },
        { status: 400 },
      );
    }

    if (!claimIdempotencyKey(`campaign:${idempotencyKey}`)) {
      return NextResponse.json(
        { error: "Cette campagne a déjà été soumise avec la même clé d’idempotence." },
        { status: 409 },
      );
    }

    const config = getResendConfig();
    if (!config.liveSendEnabled) {
      return NextResponse.json(
        {
          error:
            "Les envois réels sont désactivés. Activez EMAIL_DASHBOARD_ENABLE_REAL_SENDS=true.",
        },
        { status: 403 },
      );
    }

    if (process.env.NODE_ENV === "production" && !config.sendToken) {
      return NextResponse.json(
        {
          error:
            "En production, EMAIL_DASHBOARD_SEND_TOKEN est requis pour protéger l’envoi.",
        },
        { status: 403 },
      );
    }

    if (config.sendToken && body.sendToken?.trim() !== config.sendToken) {
      return NextResponse.json(
        { error: "Jeton d’autorisation d’envoi invalide." },
        { status: 403 },
      );
    }

    assertFromEmailSupportsLiveSends(config.from);

    const rendered = await renderCampaignHtml(campaignId, body.variables, body.content);

    const result = await resend.emails.send({
      from: config.from,
      to: recipients,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      replyTo: config.replyTo,
      headers: { "X-Idempotency-Key": idempotencyKey },
    });

    return NextResponse.json({
      ok: true,
      recipientCount: recipients.length,
      providerId: result.data?.id ?? null,
      status: "sent",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to send campaign.",
      },
      { status: 500 },
    );
  }
}
