'use client'
import { memo } from 'react';
import { Button } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const CustomConnectButton: React.FC = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
      }) => {
        const connected = account && chain;
        if (!connected) {
          return (
            <Button onClick={openConnectModal} type="button">
              Connect Wallet
            </Button>
          );
        }
        if (chain.unsupported) {
          return (
            <button onClick={openChainModal} type="button">
              Wrong network
            </button>
          );
        }

        return (
            <Button onClick={openAccountModal}>
              {account.displayName}
              {account.displayBalance
                ? ` (${account.displayBalance})`
                : ''}
            </Button>
          );
      }}
    </ConnectButton.Custom>
  );
};

export default memo(CustomConnectButton);