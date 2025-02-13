import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from "viem/chains";

const PROJECT_ID = '552e78ef3babf27a08dbc17dd0fee758';

const config = getDefaultConfig({
    appName: 'Jumper Challenge',
    projectId: PROJECT_ID,
    chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
    ssr: true,
  });

export default config;