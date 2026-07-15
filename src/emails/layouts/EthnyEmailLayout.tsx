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
    <html>
      <head />
      <body style={{ margin: 0, padding: 0, backgroundColor: "#f7f4ee" }}>
        <div
          style={{
            display: "none",
            overflow: "hidden",
            lineHeight: "1px",
            opacity: 0,
            maxHeight: 0,
            maxWidth: 0,
          }}
        >
          {previewText}
        </div>
        <div
          style={{
            maxWidth: "640px",
            margin: "32px auto",
            padding: "24px",
            backgroundColor: "#fffaf2",
            borderRadius: "18px",
            border: "1px solid rgba(42, 42, 42, 0.16)",
            boxShadow: "0 16px 40px rgba(28, 59, 52, 0.08)",
          }}
        >
          <div
            style={{
              marginBottom: "24px",
              padding: "18px 20px",
              borderRadius: "16px",
              border: "1px solid rgba(42, 42, 42, 0.14)",
              background: "linear-gradient(135deg, #f1ece2 0%, #fffaf2 100%)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#2f5d50",
              }}
            >
              Ethny
            </p>
            <h1
              style={{
                margin: "8px 0 0",
                fontSize: "28px",
                lineHeight: 1.2,
                color: "#23463c",
              }}
            >
              {title}
            </h1>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
