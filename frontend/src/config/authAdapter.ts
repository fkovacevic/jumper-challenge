import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { createSiweMessage } from "viem/siwe";

export const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      return 'some-nonce'
    },
    createMessage: ({ nonce, address, chainId }) => {
      return createSiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });
    },
    // Not implemented
    verify: async ({ message, signature }) => {
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      });
      return Boolean(verifyRes.ok);
    },
    // Not implemented
    signOut: async () => {
      await fetch('/api/logout');
    },
  });
