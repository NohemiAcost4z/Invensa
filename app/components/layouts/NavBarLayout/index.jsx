'use client';
import { rutasNavegables } from '../../../../src/constants';
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import styles from './NavBarLayout.module.scss';
import { useEstadoApp } from '../../../context/EstadoAppContext';
import {
  AddPhotoAlternate as AddAPhotoIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useState } from 'react';

function NavBarLayout({ children }) {
  const { rutaActiva, usuario, setRutaActiva } = useEstadoApp();
  const [anchorEl, setAnchorEl] = useState(null);

  const rutas = rutasNavegables(!!usuario?.idUsuario);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    await fetch('api/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar className={styles.toolbar}>
          <Avatar
            src={
              usuario?.idUsuario
                ? `/api/imagenes/${usuario.fotoPerfil}`
                : '/imagenes/logo-invensa.png'
            }
          />
          <Box display="flex">
            <Container className={styles.links}>
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
            </Container>
            <div>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon
                  size="large"
                  aria-label="menu de gestión de la cuenta"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem>
                  <AddAPhotoIcon sx={{ marginRight: '0.4em' }} />
                  Cambiar foto de perfil
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ marginRight: '0.4em' }} />
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </Box>
        </Toolbar>
      </AppBar>
      <Box>{children}</Box>
    </>
  );
}

export { NavBarLayout };
