import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
} from "@react-email/components";
import type { ReactNode } from "react";

interface EthnyEmailLayoutProps {
  previewText: string;
  title: string;
  children: ReactNode;
}

export function EthnyEmailLayout({
  previewText,
  title,
  children,
}: EthnyEmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body style={{ margin: 0, padding: 0, backgroundColor: "#f4f7f2" }}>
          <Container
            style={{
              maxWidth: "640px",
              margin: "32px auto",
              padding: "24px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e7efdf",
            }}
          >
            <Section style={{ marginBottom: "24px" }}>
              <Heading
                as="h1"
                style={{
                  margin: 0,
                  fontSize: "28px",
                  lineHeight: 1.2,
                  color: "#173d29",
                }}
              >
                {title}
              </Heading>
            </Section>
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
