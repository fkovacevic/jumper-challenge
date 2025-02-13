import { Inter } from "next/font/google";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar } from "@mui/material";
import '@rainbow-me/rainbowkit/styles.css';

import theme from '../theme';
import styles from './styles.module.scss';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyClassName = `${inter.className} ${styles['root-container']}`

  return (
    <html lang="en">
      <body className={bodyClassName} style={ { marginTop: '-8px'}}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <AppBar color='transparent' elevation={0}>
              <Toolbar sx={{ color: '#FFCC70', fontWeight: 'bold', fontSize: '24px'}}>
                Jumper Challenge 🚀
              </Toolbar>
            </AppBar>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
    </html>
  );
}
