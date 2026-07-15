export interface CampaignVariables {
  firstName: string;
  lastName: string;
  email: string;
  eventType: string;
  eventDate: string;
  city: string;
  guestCount: string;
  websiteLink: string;
  bookingLink: string;
  unsubscribeLink: string;
}

export const defaultCampaignVariables: CampaignVariables = {
  firstName: "",
  lastName: "",
  email: "",
  eventType: "",
  eventDate: "",
  city: "",
  guestCount: "",
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
