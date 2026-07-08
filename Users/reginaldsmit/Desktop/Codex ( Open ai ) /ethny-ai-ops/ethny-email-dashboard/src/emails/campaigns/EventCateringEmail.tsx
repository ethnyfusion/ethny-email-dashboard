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

export function EventCateringEmail({ variables }: Props) {
  return (
    <EthnyEmailLayout previewText="Elevated catering for your next event." title="Elevated catering for your next event">
      <EmailHeader title="Event catering" subtitle="Designed for memorable occasions." />
      <Section>
        <Text style={{ margin: "0 0 12px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          Hello {variables.firstName},
        </Text>
        <Text style={{ margin: "0 0 12px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          Ethny brings polished catering experiences to elegant events, intimate gatherings, and special celebrations.
        </Text>
        <Text style={{ margin: "0 0 20px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          Let us design a catering experience that feels effortless and unforgettable.
        </Text>
        <EthnyButton href={variables.bookingLink} label="Plan your event" />
        <EthnySignature />
      </Section>
      <EmailFooter unsubscribeLink={variables.unsubscribeLink} />
    </EthnyEmailLayout>
  );
}
