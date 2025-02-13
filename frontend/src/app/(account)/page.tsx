'use client'
import { Alert, Button,  CircularProgress, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useAccount, useSignMessage } from "wagmi"
import Link from "next/link";
import { useRouter } from "next/navigation";

import * as AuthService from '@/services/auth';
import { useAuthContext } from "@/contexts/authContext";
import ConnectButton from "@/components/ConnectButton";
import { authenticationAdapter } from "@/config/authAdapter";

import styles from './styles.module.scss';
import { disconnect } from "wagmi/actions";
import config from "@/config/wagmiConfig";

export default function Home() {
  const { isConnected, address, chainId, isReconnecting } = useAccount();
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const signUpUser = useCallback(async () => {
    setError(null);

    if (!address) {
      setError('No address found, check your connection with the wallet.');
      return;
    }
    if (!chainId) {
      setError('No chainId found, check your connection with the wallet.');
      return;
    }

    const nonce = await authenticationAdapter.getNonce();
    const message = authenticationAdapter.createMessage({ address, chainId, nonce });

    try {
      const signature = await signMessageAsync({ message, account: address});
      setIsAuthenticating(true);
      await AuthService.singUpUser(message, signature, address);
      setIsAuthenticating(false);
      setIsAuthenticated(true);
    } catch (e: unknown) {
      let errorMessage: string;
      if (e instanceof Error) {
        errorMessage = e.message;
      } else {
        errorMessage = JSON.stringify(e);
      }

      setError(errorMessage);
      setIsAuthenticating(false);
    }
  }, [address, chainId, setIsAuthenticated, signMessageAsync]);

  const resolveNextAction = useCallback(() => {
    if (isConnected && !isAuthenticated) {
      return (
        <Button onClick={signUpUser}>
          Sign Up to Check Balance
        </Button>
      )
    }

    if (isConnected && isAuthenticated) {
      return (
        <Link href={`balances/${address}`}>
          <Button>
            Go to Balance
          </Button>
        </Link>
      )
    }
  } , [address, isAuthenticated, isConnected, signUpUser]);

  if (isReconnecting || isAuthenticating) {
    let infoText = '';
    if (isReconnecting) {
      infoText = 'Checking wallet connection...';
    } else if (isAuthenticating) {
      infoText = 'Signing up...';
    }
    return (
      <div className={styles['card-context']}>
        <Typography variant="h5">
          {infoText}
        </Typography>
        <CircularProgress sx={{ color: 'primary.contrastText'}}/>
      </div>
    )
  }

  const resolveTitle = () => {
    if (!isConnected && !isAuthenticated) {
      return 'Connect your Wallet to Sign Up!';
    } else if (isConnected && !isAuthenticated) {
      return 'Successfully Connected Wallet!';
    } else {
      return 'Welcome!';
    }
  }

  return (
    <div className={styles['card-context']}>
        <Typography fontWeight='bold' variant="h1" className={styles['header']}>
            {resolveTitle()}
        </Typography>
        <ConnectButton />
       {resolveNextAction()}
       <Button onClick={() => disconnect(config)}>
    asd
       </Button> 
       {error && (
          <div className={styles['error-container']}>
            <Alert variant="outlined" severity="error" sx={{ color: 'primary.light'}} >
              {error}
            </Alert>
          </div>
       )}
    </div>
  )
};
