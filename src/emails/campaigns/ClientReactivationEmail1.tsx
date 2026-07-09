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

export function ClientReactivationEmail1({ variables, content }: Props) {
  return (
    <EthnyEmailLayout previewText={content.previewText} title={content.title}>
      <EmailHeader title={content.headerTitle} subtitle={content.headerSubtitle} />
      <Section>
        <Text style={{ margin: "0 0 12px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          {content.intro.replace("{firstName}", variables.firstName)}
        </Text>
        <Text style={{ margin: "0 0 12px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          {content.body.split(". ")[0] + "."}
        </Text>
        <Text style={{ margin: "0 0 20px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          {content.body.split(". ")[1] ?? content.body}
        </Text>
        <EthnyButton href={variables.bookingLink} label={content.ctaLabel} />
        <EthnySignature />
      </Section>
      <EmailFooter unsubscribeLink={variables.unsubscribeLink} />
    </EthnyEmailLayout>
  );
}
