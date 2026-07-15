import type { CampaignId } from "@/lib/email-campaigns";
import type { CampaignVariables } from "@/lib/email-variables";

export interface CampaignTemplateContent {
  category: "Annonce" | "Réactivation" | "Avis" | "Storytelling";
  subject: string;
  previewText: string;
  title: string;
  intro: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  signature: string;
  plainText: string;
  imageUrl?: string;
}

const defaultCampaignContent: Record<CampaignId, CampaignTemplateContent> = {
  "new-website-announcement": {
    category: "Annonce",
    subject: "Ethny dévoile sa nouvelle expérience",
    previewText: "Une nouvelle étape premium pour vos événements privés et professionnels.",
    title: "L’univers Ethny évolue",
    intro: "Bonjour {{firstName | default: \"à vous\"}},",
    body: "Nous lançons une version enrichie de notre univers pour rendre chaque projet encore plus fluide, élégant et humain. Découvrez notre approche et planifiez votre prochaine expérience gastronomique avec le Chef Réginald Smit.",
    ctaLabel: "Découvrir l’expérience Ethny",
    ctaUrl: "{{websiteLink | default: \"https://www.ethny.com\"}}",
    signature: "Chef Réginald Smit, Ethny Kitchen",
    plainText:
      "Bonjour {{firstName | default: \"à vous\"}},\n\nNous lançons une version enrichie de notre univers pour rendre chaque projet encore plus fluide, élégant et humain.\n\nDécouvrez notre approche : {{websiteLink | default: \"https://www.ethny.com\"}}\n\nChef Réginald Smit, Ethny Kitchen",
  },
  "client-reactivation": {
    category: "Réactivation",
    subject: "Un nouveau projet à imaginer ensemble ?",
    previewText: "Reprenons contact pour concevoir votre prochaine expérience sur mesure.",
    title: "Reprenons contact",
    intro: "Bonjour {{firstName | default: \"à vous\"}},",
    body: "Vous avez déjà fait confiance à Ethny. Nous serions ravis de créer une nouvelle expérience adaptée à votre événement, avec la même exigence artisanale et premium.",
    ctaLabel: "Planifier un échange",
    ctaUrl: "{{bookingLink | default: \"https://www.ethny.com/book\"}}",
    signature: "Chef Réginald Smit, Ethny Kitchen",
    plainText:
      "Bonjour {{firstName | default: \"à vous\"}},\n\nVous avez déjà fait confiance à Ethny. Nous serions ravis de créer une nouvelle expérience adaptée à votre événement.\n\nRéserver un échange : {{bookingLink | default: \"https://www.ethny.com/book\"}}\n\nChef Réginald Smit, Ethny Kitchen",
  },
  "private-chef-experience": {
    category: "Avis",
    subject: "Votre retour sur votre expérience Ethny",
    previewText: "Votre avis nous aide à perfectionner chaque détail de nos prestations.",
    title: "Votre avis compte",
    intro: "Bonjour {{firstName | default: \"à vous\"}},",
    body: "Merci de votre confiance. Votre retour nous permet d’améliorer continuellement nos expériences privées et événementielles. Quelques lignes suffisent pour nous aider à progresser.",
    ctaLabel: "Partager mon avis",
    ctaUrl: "{{websiteLink | default: \"https://www.ethny.com\"}}/avis",
    signature: "Chef Réginald Smit, Ethny Kitchen",
    plainText:
      "Bonjour {{firstName | default: \"à vous\"}},\n\nMerci de votre confiance. Votre retour nous aide à affiner chaque détail de nos prestations.\n\nPartager votre avis : {{websiteLink | default: \"https://www.ethny.com\"}}/avis\n\nChef Réginald Smit, Ethny Kitchen",
  },
  "event-catering": {
    category: "Storytelling",
    subject: "Dans les coulisses d’une réception Ethny",
    previewText: "Un regard sur notre savoir-faire artisanal pour des événements mémorables.",
    title: "L’histoire derrière chaque service",
    intro: "Bonjour {{firstName | default: \"à vous\"}},",
    body: "Chaque réception Ethny est construite autour d’une vision : précision culinaire, sens du détail et chaleur humaine. Découvrez comment nous orchestrons les événements privés et professionnels en Belgique.",
    ctaLabel: "Lire l’histoire",
    ctaUrl: "{{websiteLink | default: \"https://www.ethny.com\"}}/actualites",
    signature: "Chef Réginald Smit, Ethny Kitchen",
    plainText:
      "Bonjour {{firstName | default: \"à vous\"}},\n\nChaque réception Ethny est construite autour d’une vision : précision culinaire, sens du détail et chaleur humaine.\n\nLire l’histoire : {{websiteLink | default: \"https://www.ethny.com\"}}/actualites\n\nChef Réginald Smit, Ethny Kitchen",
  },
};

const variablePattern = /\{\{\s*([a-zA-Z0-9_]+)\s*(?:\|\s*default:\s*"([^"]*)")?\s*\}\}/g;
const oldPattern = /\{([a-zA-Z0-9_]+)\}/g;

export function getDefaultCampaignContent(id: CampaignId): CampaignTemplateContent {
  return defaultCampaignContent[id] ?? defaultCampaignContent["new-website-announcement"];
}

export function resolveCampaignContent(
  campaignId: CampaignId,
  variables: CampaignVariables,
  overrides?: CampaignTemplateContent,
): CampaignTemplateContent {
  const base = overrides ?? getDefaultCampaignContent(campaignId);
  return {
    ...base,
    subject: interpolateTemplate(base.subject, variables),
    previewText: interpolateTemplate(base.previewText, variables),
    title: interpolateTemplate(base.title, variables),
    intro: interpolateTemplate(base.intro, variables),
    body: interpolateTemplate(base.body, variables),
    ctaLabel: interpolateTemplate(base.ctaLabel, variables),
    ctaUrl: interpolateTemplate(base.ctaUrl, variables),
    signature: interpolateTemplate(base.signature, variables),
    plainText: interpolateTemplate(base.plainText, variables),
    imageUrl: base.imageUrl ? interpolateTemplate(base.imageUrl, variables) : undefined,
  };
}

function interpolateTemplate(template: string, variables: CampaignVariables) {
  const withFallbacks = template.replace(
    variablePattern,
    (_match, variableName: keyof CampaignVariables, fallback: string | undefined) => {
      const value = variables[variableName];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
      return fallback ?? "";
    },
  );

  return withFallbacks
    .replace(oldPattern, (_match, variableName: keyof CampaignVariables) => {
      const value = variables[variableName];
      return typeof value === "string" ? value.trim() : "";
    })
    .replace(variablePattern, "")
    .trim();
}
