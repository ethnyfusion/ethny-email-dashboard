import type { CampaignTemplateContent } from "@/lib/email-content";
import type { CampaignVariables } from "@/lib/email-variables";

export interface CampaignAssistantInput {
  content: CampaignTemplateContent;
  variables: CampaignVariables;
  recipientCount: number;
}

export interface CampaignAssistantOutput {
  warnings: string[];
  suggestions: {
    editorialAngle: string;
    suggestedSegment: string;
  };
}

const maxSubjectLength = 70;
const maxPreviewLength = 110;
const maxBodyLength = 1200;

export function getCampaignAssistantOutput({
  content,
  variables,
  recipientCount,
}: CampaignAssistantInput): CampaignAssistantOutput {
  const warnings: string[] = [];

  if (content.subject.trim().length > maxSubjectLength) {
    warnings.push("L’objet dépasse 70 caractères.");
  }

  if (content.previewText.trim().length > maxPreviewLength) {
    warnings.push("Le préheader dépasse 110 caractères.");
  }

  if (!content.ctaLabel.trim()) {
    warnings.push("Le CTA est manquant.");
  }

  if (!isHttpUrl(content.ctaUrl)) {
    warnings.push("L’URL principale est absente ou invalide.");
  }

  if (content.body.trim().length > maxBodyLength) {
    warnings.push("Le message est long pour un e-mail marketing.");
  }

  if (content.body.includes("{{") && !content.body.includes("default:")) {
    warnings.push("Certaines variables n’ont pas de fallback.");
  }

  if (!variables.firstName.trim()) {
    warnings.push("Le fallback prénom sera utilisé pour les contacts sans prénom.");
  }

  const suggestions = {
    editorialAngle: getEditorialAngle(content.category),
    suggestedSegment: getSuggestedSegment(content.category, recipientCount),
  };

  return { warnings, suggestions };
}

function getEditorialAngle(category: string) {
  switch (category) {
    case "Annonce":
      return "Mettre en avant la nouveauté et la promesse premium en ouverture.";
    case "Réactivation":
      return "Rappeler la relation passée et proposer une reprise simple.";
    case "Avis":
      return "Valoriser la confiance et demander un retour concret.";
    default:
      return "Storytelling éditorial autour du chef et du savoir-faire artisanal.";
  }
}

function getSuggestedSegment(category: string, recipientCount: number) {
  if (category === "Réactivation") {
    return "Clients inactifs depuis 6 à 12 mois.";
  }

  if (category === "Avis") {
    return "Clients servis récemment (30 jours).";
  }

  if (recipientCount > 150) {
    return "Segment large: vérifier exclusions et désinscriptions avant envoi.";
  }

  return "Segment principal validé pour la campagne sélectionnée.";
}

function isHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
