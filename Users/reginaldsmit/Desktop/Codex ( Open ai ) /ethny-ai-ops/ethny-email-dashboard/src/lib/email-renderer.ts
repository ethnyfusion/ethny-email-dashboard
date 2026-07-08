import { render } from "@react-email/render";
import { getEmailCampaign } from "@/lib/email-campaigns";
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
): Promise<RenderedCampaign> {
  const campaign = getEmailCampaign(campaignId);

  if (!campaign) {
    throw new Error(`No email campaign found for id: ${campaignId}`);
  }

  const resolvedVariables = resolveCampaignVariables(variables);
  const html = await render(campaign.component(resolvedVariables));

  return {
    html,
    subject: campaign.subject,
    previewText: campaign.previewText,
  };
}
