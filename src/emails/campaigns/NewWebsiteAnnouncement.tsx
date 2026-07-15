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

export function NewWebsiteAnnouncement({ variables, content }: Props) {
  return (
    <EthnyEmailLayout previewText={content.previewText} title={content.title}>
      <EmailHeader title={content.title} category={content.category} />
      <div>
        <p style={{ margin: "0 0 12px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          {content.intro}
        </p>
        <p style={{ margin: "0 0 20px", fontSize: "16px", lineHeight: 1.6, color: "#2d3f35" }}>
          {content.body}
        </p>
        {content.imageUrl ? (
          <img
            src={content.imageUrl}
            alt=""
            width="560"
            style={{ width: "100%", borderRadius: "14px", marginBottom: "20px" }}
          />
        ) : null}
        <EthnyButton href={content.ctaUrl} label={content.ctaLabel} />
        <EthnySignature name={content.signature} />
      </div>
      <EmailFooter unsubscribeLink={variables.unsubscribeLink} />
    </EthnyEmailLayout>
  );
}
