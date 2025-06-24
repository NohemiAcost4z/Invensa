'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#26041d' },
    background: {
      default: '#f1e1dd',
      paper: '#ffffff',
    },
    text: { primary: '#28282B' },
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  cssVariables: true,
});

export default theme;
