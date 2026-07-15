import { Img, Section, Text } from "@react-email/components";

const logoUrl =
  "https://raw.githubusercontent.com/ethnyfusion/ethny-fusion-v2/4550affa0662a32f0b278a771316cac50144600a/public/logo/ethny-logo.svg";

interface EmailHeaderProps {
  title: string;
  category: string;
}

export function EmailHeader({ title, category }: EmailHeaderProps) {
  return (
    <Section
      style={{
        marginBottom: "24px",
        padding: "18px 20px",
        borderRadius: "16px",
        border: "1px solid #e3efd8",
        background: "linear-gradient(135deg, #ffffff 0%, #f5fbef 100%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "60px",
            height: "60px",
            borderRadius: "18px",
            border: "1px solid #d9e9cd",
            backgroundColor: "#f4f8ee",
            boxShadow: "0 10px 24px rgba(31, 94, 59, 0.1)",
          }}
        >
          <Img src={logoUrl} alt="Ethny" width="34" height="34" />
        </div>
        <div>
          <Text style={{ margin: 0, fontSize: "12px", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#2f5d50" }}>
            {category}
          </Text>
          <Text style={{ margin: "6px 0 0", fontSize: "17px", fontWeight: 700, color: "#173d29" }}>
            {title}
          </Text>
        </div>
      </div>
    </Section>
  );
}
