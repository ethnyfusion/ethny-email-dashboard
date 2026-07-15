import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "@/lib/admin-auth";
import {
  getResendClient,
  getResendConfig,
  getResendFromEmail,
  getResendReplyToEmail,
} from "@/lib/resend";

export const runtime = "nodejs";

type SendHtmlTestBody = {
  campaignId?: string;
  subject?: string;
  html?: string;
  idempotencyKey?: string;
};

const recentRequests = new Map<string, number[]>();
const sentIdempotencyKeys = new Map<string, number>();
const inFlightIdempotencyKeys = new Set<string>();
const rateWindowMs = 60_000;
const maxRequestsPerWindow = 4;
const idempotencyWindowMs = 120_000;

function htmlToText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h1|h2|h3|li|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized email test request." },
      { status: 401 },
    );
  }

  try {
    const rateKey = getRateKey(request);
    const now = Date.now();
    const recentHits = (recentRequests.get(rateKey) ?? []).filter(
      (timestamp) => now - timestamp < rateWindowMs,
    );

    for (const [key, timestamps] of recentRequests.entries()) {
      const activeHits = timestamps.filter(
        (timestamp) => now - timestamp < rateWindowMs,
      );

      if (activeHits.length === 0) {
        recentRequests.delete(key);
      } else {
        recentRequests.set(key, activeHits);
      }
    }

    for (const [key, timestamp] of sentIdempotencyKeys.entries()) {
      if (now - timestamp > idempotencyWindowMs) {
        sentIdempotencyKeys.delete(key);
      }
    }

    if (recentHits.length >= maxRequestsPerWindow) {
      return NextResponse.json(
        { ok: false, error: "Trop de tests envoyes. Patientez une minute." },
        { status: 429 },
      );
    }

    const body = (await request.json()) as SendHtmlTestBody;
    const subject = body.subject?.trim();
    const html = body.html?.trim();
    const { testEmail: to } = getResendConfig();
    const idempotencyKey =
      body.idempotencyKey ??
      `${body.campaignId ?? "draft"}:${subject ?? ""}:${html?.length ?? 0}`;

    if (!subject || subject.length > 180) {
      return NextResponse.json(
        {
          ok: false,
          error: "Subject is required and must stay under 180 characters.",
        },
        { status: 400 },
      );
    }

    if (!html || html.length < 120) {
      return NextResponse.json(
        { ok: false, error: "HTML draft is too short to send." },
        { status: 400 },
      );
    }

    if (/<script[\s>]/i.test(html)) {
      return NextResponse.json(
        { ok: false, error: "HTML refuse : balise script detectee." },
        { status: 400 },
      );
    }

    if (html.length > 500_000) {
      return NextResponse.json(
        { ok: false, error: "HTML draft is too large." },
        { status: 400 },
      );
    }

    if (
      sentIdempotencyKeys.has(idempotencyKey) ||
      inFlightIdempotencyKeys.has(idempotencyKey)
    ) {
      return NextResponse.json(
        { ok: false, error: "Envoi test deja traite pour ce brouillon." },
        { status: 409 },
      );
    }

    const resend = getResendClient();
    if (!resend) {
      return NextResponse.json(
        { ok: false, error: "Missing RESEND_API_KEY." },
        { status: 500 },
      );
    }

    recentRequests.set(rateKey, [...recentHits, now]);
    inFlightIdempotencyKeys.add(idempotencyKey);

    const { data, error } = await resend.emails.send({
      from: getResendFromEmail(),
      replyTo: getResendReplyToEmail(),
      to: [to],
      subject,
      html,
      text: htmlToText(html),
    });

    if (error) {
      inFlightIdempotencyKeys.delete(idempotencyKey);
      return NextResponse.json(
        { ok: false, error: error.message, campaignId: body.campaignId },
        { status: 400 },
      );
    }

    inFlightIdempotencyKeys.delete(idempotencyKey);
    sentIdempotencyKeys.set(idempotencyKey, Date.now());

    return NextResponse.json({
      ok: true,
      id: data?.id,
      to,
      campaignId: body.campaignId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown send error.",
      },
      { status: 500 },
    );
  }
}

function getRateKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}
