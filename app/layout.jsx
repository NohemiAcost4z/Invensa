import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Roboto } from 'next/font/google';
import theme from '../src/theme';
import { EstadoAppContextProvider } from './context/EstadoAppContext';
import { NavBarLayout } from './components/layouts/NavBarLayout';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import './global.scss';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <EstadoAppContextProvider>
              <Box>
                <NavBarLayout>{children}</NavBarLayout>
              </Box>
            </EstadoAppContextProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: {
    template: '%s | Invensa',
    default: 'Invensa',
  },
  description: 'Gestión de inventario',
  generator: 'Next.js',
  applicationName: 'Invensa',
  referrer: 'origin-when-cross-origin',
  keywords: ['Gestión', 'Inventario', 'Belleza', 'Maquillaje', 'Cosméticos'],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  cathegory: 'management',
};
