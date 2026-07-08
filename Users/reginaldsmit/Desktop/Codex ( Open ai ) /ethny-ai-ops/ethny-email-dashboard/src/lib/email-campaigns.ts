import { createElement, type ReactElement } from "react";
import { ClientReactivationEmail1 } from "@/emails/campaigns/ClientReactivationEmail1";
import { EventCateringEmail } from "@/emails/campaigns/EventCateringEmail";
import { NewWebsiteAnnouncement } from "@/emails/campaigns/NewWebsiteAnnouncement";
import { PrivateChefExperience } from "@/emails/campaigns/PrivateChefExperience";
import type { CampaignVariables } from "@/lib/email-variables";

export type CampaignId =
  | "new-website-announcement"
  | "client-reactivation"
  | "private-chef-experience"
  | "event-catering";

export interface EmailCampaign {
  id: CampaignId;
  name: string;
  description: string;
  subject: string;
  previewText: string;
  category: string;
  component: (variables: CampaignVariables) => ReactElement;
}

export const emailCampaigns: EmailCampaign[] = [
  {
    id: "new-website-announcement",
    name: "New Website Announcement",
    description: "Launch a refined introduction to the new Ethny experience.",
    subject: "A new Ethny experience is live",
    previewText: "Discover the new Ethny website and the elevated experience behind it.",
    category: "Launch",
    component: (variables) => createElement(NewWebsiteAnnouncement, { variables }),
  },
  {
    id: "client-reactivation",
    name: "Client Reactivation",
    description: "Re-engage prior clients with a personal invitation to reconnect.",
    subject: "We would love to welcome you back",
    previewText: "Come back for a tailored experience designed around your preferences.",
    category: "Reactivation",
    component: (variables) => createElement(ClientReactivationEmail1, { variables }),
  },
  {
    id: "private-chef-experience",
    name: "Private Chef Experience",
    description: "Invite guests into a premium private chef journey.",
    subject: "A private chef experience, crafted for you",
    previewText: "Bring a memorable chef-led moment to your next occasion.",
    category: "Luxury",
    component: (variables) => createElement(PrivateChefExperience, { variables }),
  },
  {
    id: "event-catering",
    name: "Event Catering",
    description: "Present a polished option for premium event catering.",
    subject: "Elevated catering for your next event",
    previewText: "Let Ethny bring culinary excellence to your next gathering.",
    category: "Events",
    component: (variables) => createElement(EventCateringEmail, { variables }),
  },
];

export function getEmailCampaign(id: string): EmailCampaign | undefined {
  return emailCampaigns.find((campaign) => campaign.id === id);
}
