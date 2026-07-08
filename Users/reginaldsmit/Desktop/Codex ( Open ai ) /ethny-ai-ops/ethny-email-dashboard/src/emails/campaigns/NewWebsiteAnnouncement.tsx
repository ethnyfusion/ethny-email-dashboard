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

export function NewWebsiteAnnouncement({ variables }: Props) {
  return (
    <EthnyEmailLayout previewText="Discover Ethny’s new digital experience." title="A fresh Ethny experience is live">
      <EmailHeader title="A fresh Ethny experience is live" subtitle="Welcome to the new way to discover our world." />
      <Section>
        <Text style={{ margin: "0 0 12px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          Hello {variables.firstName},
        </Text>
        <Text style={{ margin: "0 0 12px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          We are proud to unveil a new chapter for Ethny, shaped around clarity, elegance, and effortless planning.
        </Text>
        <Text style={{ margin: "0 0 20px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          Take a look at the new website and explore what is possible for your next unforgettable experience.
        </Text>
        <EthnyButton href={variables.websiteLink} label="Visit the new website" />
        <EthnySignature />
      </Section>
      <EmailFooter unsubscribeLink={variables.unsubscribeLink} />
    </EthnyEmailLayout>
  );
}
