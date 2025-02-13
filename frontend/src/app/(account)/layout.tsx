'use client'
import * as React from 'react';
import { Card, CardContent } from "@mui/material";
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import config from "@/config/wagmiConfig";
import { AuthProvider } from '@/contexts/authContext';

import styles from './styles.module.scss';

const queryClient = new QueryClient();

export default function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className={styles['card-container']} >
            <Card className={styles['card']}>
                <CardContent className={styles['card-context']} sx={{ padding: '0', ":last-child": { paddingBottom: 0}}}>
                    <WagmiProvider config={config}>
                        <AuthProvider>
                            <QueryClientProvider client={queryClient}>
                            <RainbowKitProvider >
                                {children}
                            </RainbowKitProvider>
                            </QueryClientProvider>
                        </AuthProvider>
                    </WagmiProvider>
                </CardContent>
            </Card>
        </div>
    );
};
