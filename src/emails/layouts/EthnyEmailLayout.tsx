import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
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
              borderRadius: "18px",
              border: "1px solid #e7efdf",
              boxShadow: "0 16px 40px rgba(31, 94, 59, 0.08)",
            }}
          >
            <Section
              style={{
                marginBottom: "24px",
                padding: "18px 20px",
                borderRadius: "16px",
                border: "1px solid #e3efd8",
                background: "linear-gradient(135deg, #f8fcf4 0%, #ffffff 100%)",
              }}
            >
              <Text style={{ margin: 0, fontSize: "12px", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#2f7a4f" }}>
                Ethny
              </Text>
              <Heading
                as="h1"
                style={{
                  margin: "8px 0 0",
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
