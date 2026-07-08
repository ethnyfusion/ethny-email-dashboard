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

export function PrivateChefExperience({ variables }: Props) {
  return (
    <EthnyEmailLayout previewText="A private chef experience, crafted for you." title="A private chef experience, crafted for you">
      <EmailHeader title="Private chef experience" subtitle="Luxury dining, arranged with care." />
      <Section>
        <Text style={{ margin: "0 0 12px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          Hello {variables.firstName},
        </Text>
        <Text style={{ margin: "0 0 12px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          Discover how a private chef experience can bring exceptional service, taste, and atmosphere to your next gathering.
        </Text>
        <Text style={{ margin: "0 0 20px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          Tailored for intimate dinners, celebrations, or elevated hosting moments.
        </Text>
        <EthnyButton href={variables.bookingLink} label="Explore private chef options" />
        <EthnySignature />
      </Section>
      <EmailFooter unsubscribeLink={variables.unsubscribeLink} />
    </EthnyEmailLayout>
  );
}
