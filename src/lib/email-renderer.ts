import { render } from "@react-email/render";
import { getEmailCampaign } from "@/lib/email-campaigns";
import {
  getDefaultCampaignContent,
  resolveCampaignContent,
  type CampaignTemplateContent,
} from "@/lib/email-content";
import {
  resolveCampaignVariables,
  type CampaignVariables,
} from "@/lib/email-variables";
import type { CampaignId } from "@/lib/email-campaigns";

export interface RenderedCampaign {
  html: string;
  text: string;
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
  const resolvedContent = resolveCampaignContent(
    campaignId as CampaignId,
    resolvedVariables,
    content ?? getDefaultCampaignContent(campaignId as CampaignId),
  );
  const emailElement = campaign.component(resolvedVariables, resolvedContent);
  const html = await render(emailElement);
  const generatedText = await render(emailElement, { plainText: true });
  const text = generatedText.trim() || resolvedContent.plainText;

  return {
    html,
    text,
    subject: resolvedContent.subject,
    previewText: resolvedContent.previewText,
  };
}
