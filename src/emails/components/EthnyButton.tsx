import { Button } from "@react-email/components";

interface EthnyButtonProps {
  href: string;
  label: string;
}

export function EthnyButton({ href, label }: EthnyButtonProps) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: "#2f5d50",
        borderRadius: "999px",
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: 600,
        padding: "12px 20px",
        textDecoration: "none",
      }}
    >
      {label}
    </Button>
  );
}
