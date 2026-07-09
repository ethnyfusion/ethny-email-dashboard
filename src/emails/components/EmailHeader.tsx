import { Img, Section, Text } from "@react-email/components";

interface EmailHeaderProps {
  title: string;
  subtitle: string;
}

export function EmailHeader({ title, subtitle }: EmailHeaderProps) {
  return (
    <Section style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Img
          src="https://www.ethny.com/logo.png"
          alt="Ethny"
          width="48"
          height="48"
          style={{ borderRadius: "12px" }}
        />
        <div>
          <Text style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#173d29" }}>
            {title}
          </Text>
          <Text style={{ margin: "4px 0 0", fontSize: "14px", color: "#5c7367" }}>
            {subtitle}
          </Text>
        </div>
      </div>
    </Section>
  );
}
