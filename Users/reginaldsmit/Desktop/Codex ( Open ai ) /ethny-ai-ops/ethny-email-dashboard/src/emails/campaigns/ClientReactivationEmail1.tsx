import { Section, Text } from "@react-email/components";
import { EmailFooter } from "@/emails/components/EmailFooter";
import { EmailHeader } from "@/emails/components/EmailHeader";
import { EthnyButton } from "@/emails/components/EthnyButton";
import { EthnySignature } from "@/emails/components/EthnySignature";
import { EthnyEmailLayout } from "@/emails/layouts/EthnyEmailLayout";
import type { CampaignVariables } from "@/lib/email-variables";

interface Props {
  variables: CampaignVariables;
}

export function ClientReactivationEmail1({ variables }: Props) {
  return (
    <EthnyEmailLayout previewText="We would love to welcome you back." title="We would love to welcome you back">
      <EmailHeader title="We would love to welcome you back" subtitle="Your next celebration is waiting." />
      <Section>
        <Text style={{ margin: "0 0 12px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          Hello {variables.firstName},
        </Text>
        <Text style={{ margin: "0 0 12px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          It has been a while, and we would love to reconnect with you for a beautifully tailored experience.
        </Text>
        <Text style={{ margin: "0 0 20px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          Let us help you plan the next dinner, event, or private occasion with ease.
        </Text>
        <EthnyButton href={variables.bookingLink} label="Book your next experience" />
        <EthnySignature />
      </Section>
      <EmailFooter unsubscribeLink={variables.unsubscribeLink} />
    </EthnyEmailLayout>
  );
}
