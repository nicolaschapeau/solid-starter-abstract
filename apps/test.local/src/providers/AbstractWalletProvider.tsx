import { AbstractPrivyProvider } from "@abstract-foundation/agw-react/privy";
import { abstractTestnet } from "viem/chains";

export default function AbstractWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AbstractPrivyProvider appId={import.meta.env.VITE_PRIVY_APP_ID!} chain={abstractTestnet}>
      {children}
    </AbstractPrivyProvider>
  );
}