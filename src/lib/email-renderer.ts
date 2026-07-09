import { render } from "@react-email/render";
import { getEmailCampaign } from "@/lib/email-campaigns";
import { getDefaultCampaignContent, type CampaignTemplateContent } from "@/lib/email-content";
import {
  resolveCampaignVariables,
  type CampaignVariables,
} from "@/lib/email-variables";

export interface RenderedCampaign {
  html: string;
  subject: string;
  previewText: string;
}

export async function renderCampaignHtml(
  campaignId: string,
  variables?: Partial<CampaignVariables>,
  content?: CampaignTemplateContent,
): Promise<RenderedCampaign> {
  const campaign = getEmailCampaign(campaignId);

  if (!campaign) {
    throw new Error(`No email campaign found for id: ${campaignId}`);
  }

  const resolvedVariables = resolveCampaignVariables(variables);
  const resolvedContent = content ?? getDefaultCampaignContent(campaignId);
  const html = await render(campaign.component(resolvedVariables, resolvedContent));

  return {
    html,
    subject: campaign.subject,
    previewText: campaign.previewText,
  };
}
