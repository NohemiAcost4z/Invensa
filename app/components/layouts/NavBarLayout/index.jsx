'use client';
import { rutasNavegables } from '../../../../src/constants';
import { AppBar, Avatar, Box, Toolbar, Typography } from '@mui/material';
import NextLink from 'next/link';
import styles from './NavBarLayout.module.scss';
import { useEstadoNavBar } from '../../../context/EstadoContext';

function NavBarLayout({ children }) {
  const rutas = rutasNavegables;
  const { rutaActiva, setRutaActiva } = useEstadoNavBar();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar className={styles.toolbar}>
          <Avatar src="/api/imagenes/268f4166-9e48-4471-a853-b34d19dbc0a0_avatar-hombre-barba-foto-perfil-masculina-generica_53562-20202.avif" />
          <Box className={styles.links}>
            {rutas.map((ruta) => (
              <NextLink
                key={ruta.href}
                href={ruta.href}
                style={{ textDecoration: 'none' }}
                onClick={() => setRutaActiva(ruta.href)}
              >
                <Typography
                  className={styles.toolbarLinks}
                  variant="h6"
                  fontWeight={rutaActiva === ruta.href ? 'bolder' : 'normal'}
                >
                  {ruta.label}
                </Typography>
              </NextLink>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box>{children}</Box>
    </>
  );
}

export { NavBarLayout };
