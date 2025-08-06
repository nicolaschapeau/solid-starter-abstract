import { usePrivy } from "@privy-io/react-auth"

type LinkedAccount = {
  embeddedWallets?: { address: string }[]
}

export function useUserInfo() {
  const { user } = usePrivy()

  // 1. Wallet (embeddedWallet ou smartWallet)
  const embeddedWallets = user?.linkedAccounts
    ?.filter((a) => (a as LinkedAccount).embeddedWallets)
    ?.flatMap((a) => (a as LinkedAccount).embeddedWallets) ?? []

  const walletAddress = embeddedWallets[0]?.address ?? ""

  // 2. Twitter
  const twitter = user?.twitter
  const displayName = twitter?.username ?? (walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Guest")
  const avatarUrl = twitter?.profilePictureUrl ?? "/dummy-avatar.png"

  return { walletAddress, displayName, avatarUrl }
}
