import { createElement, type ComponentType, type ReactElement } from "react";
import { ClientReactivationEmail1 } from "@/emails/campaigns/ClientReactivationEmail1";
import { EventCateringEmail } from "@/emails/campaigns/EventCateringEmail";
import { NewWebsiteAnnouncement } from "@/emails/campaigns/NewWebsiteAnnouncement";
import { PrivateChefExperience } from "@/emails/campaigns/PrivateChefExperience";
import type { CampaignTemplateContent } from "@/lib/email-content";
import { getDefaultCampaignContent } from "@/lib/email-content";
import type { CampaignVariables } from "@/lib/email-variables";

export type CampaignId =
  | "new-website-announcement"
  | "client-reactivation"
  | "private-chef-experience"
  | "event-catering";

interface CampaignComponentProps {
  variables: CampaignVariables;
  content: CampaignTemplateContent;
}

export interface EmailCampaign {
  id: CampaignId;
  name: string;
  description: string;
  category: string;
  component: (variables: CampaignVariables, content?: CampaignTemplateContent) => ReactElement;
}

const createCampaignElement = (
  campaignId: CampaignId,
  Component: ComponentType<CampaignComponentProps>,
  variables: CampaignVariables,
  content?: CampaignTemplateContent,
) => createElement(Component, { variables, content: content ?? getDefaultCampaignContent(campaignId) });

export const emailCampaigns: EmailCampaign[] = [
  {
    id: "new-website-announcement",
    name: "Lancement / annonce",
    description: "Présenter une nouveauté Ethny avec une tonalité premium.",
    category: "Annonce",
    component: (variables, content) =>
      createCampaignElement("new-website-announcement", NewWebsiteAnnouncement, variables, content),
  },
  {
    id: "client-reactivation",
    name: "Réactivation clients",
    description: "Relancer des anciens clients avec un angle personnalisé.",
    category: "Réactivation",
    component: (variables, content) =>
      createCampaignElement("client-reactivation", ClientReactivationEmail1, variables, content),
  },
  {
    id: "private-chef-experience",
    name: "Demande d’avis",
    description: "Collecter des retours après une prestation.",
    category: "Avis",
    component: (variables, content) =>
      createCampaignElement("private-chef-experience", PrivateChefExperience, variables, content),
  },
  {
    id: "event-catering",
    name: "Storytelling premium",
    description: "Partager une actualité éditoriale autour du chef.",
    category: "Storytelling",
    component: (variables, content) =>
      createCampaignElement("event-catering", EventCateringEmail, variables, content),
  },
];

export function getEmailCampaign(id: string): EmailCampaign | undefined {
  return emailCampaigns.find((campaign) => campaign.id === id);
}
