export interface CampaignVariables {
  firstName: string;
  websiteLink: string;
  bookingLink: string;
  unsubscribeLink: string;
}

export const defaultCampaignVariables: CampaignVariables = {
  firstName: "Alex",
  websiteLink: "https://www.ethny.com",
  bookingLink: "https://www.ethny.com/book",
  unsubscribeLink: "https://www.ethny.com/unsubscribe",
};

export function resolveCampaignVariables(
  variables?: Partial<CampaignVariables>,
): CampaignVariables {
  return {
    ...defaultCampaignVariables,
    ...variables,
  };
}
