import { NextResponse } from "next/server";
import { renderCampaignHtml } from "@/lib/email-renderer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaign") ?? "new-website-announcement";

  const rendered = await renderCampaignHtml(campaignId, {
    firstName: searchParams.get("firstName") ?? "Alex",
    websiteLink: searchParams.get("websiteLink") ?? "https://www.ethny.com",
    bookingLink: searchParams.get("bookingLink") ?? "https://www.ethny.com/book",
    unsubscribeLink: searchParams.get("unsubscribeLink") ?? "https://www.ethny.com/unsubscribe",
  });

  return NextResponse.json({
    html: rendered.html,
    subject: rendered.subject,
    previewText: rendered.previewText,
  });
}
