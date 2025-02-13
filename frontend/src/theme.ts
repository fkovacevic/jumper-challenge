'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#6a47b8",
      light: '#fcfeff',
      dark: '#2a2b3d'
    },
    secondary: {
      main: "#702F8A",
      light: "#FFEAFF",
      dark: "#612A80"
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        color: "secondary"
      },
      styleOverrides: {
        root: {
          padding: ".5rem 1.5rem",
          backgroundColor: "#6a47b8",
          color: "#fcfeff",
          width: '200px',
          ":hover": {
            backgroundColor: '#754dca',
          }
        },
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          "@media (max-width: 800px)": {
            width: "80%",
          },
        },
      },
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: '36px',
      color: '#fcfeff',
      "@media (max-width:1200px)": {
        fontSize: "24px",
      },
    },
    h5: {
      color: '#fcfeff'
    },
  },
});

export default theme;