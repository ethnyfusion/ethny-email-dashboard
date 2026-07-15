import { NextResponse } from "next/server";
import type { CampaignTemplateContent } from "@/lib/email-content";
import { renderCampaignHtml } from "@/lib/email-renderer";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    campaignId?: string;
    variables?: Record<string, string>;
    content?: CampaignTemplateContent;
  };

  const campaignId = body.campaignId ?? "new-website-announcement";

  const rendered = await renderCampaignHtml(campaignId, {
    firstName: body.variables?.firstName ?? "",
    lastName: body.variables?.lastName ?? "",
    email: body.variables?.email ?? "",
    eventType: body.variables?.eventType ?? "",
    eventDate: body.variables?.eventDate ?? "",
    city: body.variables?.city ?? "",
    guestCount: body.variables?.guestCount ?? "",
    websiteLink: body.variables?.websiteLink ?? "https://www.ethny.com",
    bookingLink: body.variables?.bookingLink ?? "https://www.ethny.com/book",
    unsubscribeLink: body.variables?.unsubscribeLink ?? "https://www.ethny.com/unsubscribe",
  }, body.content);

  return NextResponse.json({
    html: rendered.html,
    text: rendered.text,
    subject: rendered.subject,
    previewText: rendered.previewText,
  });
}
