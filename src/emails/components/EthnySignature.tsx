import { Text } from "@react-email/components";

interface EthnySignatureProps {
  name: string;
}

export function EthnySignature({ name }: EthnySignatureProps) {
  return (
    <div>
      <Text style={{ margin: "20px 0 4px", fontSize: "15px", color: "#173d29" }}>
        Warmly,
      </Text>
      <Text style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#173d29" }}>
        {name}
      </Text>
    </div>
  );
}
