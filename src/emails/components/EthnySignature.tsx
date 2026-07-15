interface EthnySignatureProps {
  name: string;
}

export function EthnySignature({ name }: EthnySignatureProps) {
  return (
    <div>
      <p style={{ margin: "20px 0 4px", fontSize: "15px", color: "#173d29" }}>
        Warmly,
      </p>
      <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#173d29" }}>
        {name}
      </p>
    </div>
  );
}
