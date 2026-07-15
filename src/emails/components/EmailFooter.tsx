interface EmailFooterProps {
  unsubscribeLink: string;
}

export function EmailFooter({ unsubscribeLink }: EmailFooterProps) {
  return (
    <div style={{ marginTop: "24px", borderTop: "1px solid #e7efdf", paddingTop: "16px" }}>
      <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.5, color: "#7a8a7d" }}>
        Ethny Kitchen • Chef privé et traiteur événementiel premium.
      </p>
      <p style={{ margin: "6px 0 0", fontSize: "12px", lineHeight: 1.5, color: "#7a8a7d" }}>
        <a href={unsubscribeLink} style={{ color: "#173d29" }}>
          Se désinscrire
        </a>
      </p>
    </div>
  );
}
