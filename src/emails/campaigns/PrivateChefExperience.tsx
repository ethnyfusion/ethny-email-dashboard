import { Section, Text } from "@react-email/components";
import { EmailFooter } from "@/emails/components/EmailFooter";
import { EmailHeader } from "@/emails/components/EmailHeader";
import { EthnyButton } from "@/emails/components/EthnyButton";
import { EthnySignature } from "@/emails/components/EthnySignature";
import { EthnyEmailLayout } from "@/emails/layouts/EthnyEmailLayout";
import type { CampaignTemplateContent } from "@/lib/email-content";
import type { CampaignVariables } from "@/lib/email-variables";

interface Props {
  variables: CampaignVariables;
  content: CampaignTemplateContent;
}

export function PrivateChefExperience({ variables, content }: Props) {
  return (
    <EthnyEmailLayout previewText={content.previewText} title={content.title}>
      <EmailHeader title={content.title} category={content.category} />
      <Section>
        <Text style={{ margin: "0 0 12px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          {content.intro}
        </Text>
        <Text style={{ margin: "0 0 20px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          {content.body}
        </Text>
        <EthnyButton href={content.ctaUrl} label={content.ctaLabel} />
        <EthnySignature name={content.signature} />
      </Section>
      <EmailFooter unsubscribeLink={variables.unsubscribeLink} />
    </EthnyEmailLayout>
  );
}
