'use client';
import { rutasNavegables } from '../../../../src/constants';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import styles from './NavBarLayout.module.scss';
import { useEstadoApp } from '../../../context/EstadoAppContext';
import {
  AddPhotoAlternate as AddAPhotoIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { ButtonUploadImagen } from '../../ButtonUploadImagen';
import { ElevationScroll } from '../../ElevationScroll';

function NavBarLayout({ children }) {
  const { rutaActiva, usuario, setRutaActiva, setUsuario } = useEstadoApp();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: typeof window !== 'undefined' ? window : undefined,
  });
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [cambiarPFPModalAbierto, setCambiarPFPModalAbierto] = useState(false);
  const [fotoDePerfil, setFotoDePerfil] = useState();

  const rutas = rutasNavegables(!!usuario?.idUsuario);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    await fetch('api/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  };

  const cambiarFotoDePerfil = async () => {
    const formData = new FormData();
    formData.append('fotoPerfil', fotoDePerfil);
    const response = await fetch('api/usuario/cambiarFotoDePerfil', {
      method: 'PATCH',
      body: formData,
      credentials: 'include',
    });
    const nombreFotoDePerfil = (await response.json()).fotoDePerfil;
    setUsuario({ ...usuario, fotoPerfil: nombreFotoDePerfil });
    setCambiarPFPModalAbierto(false);
  };

  return (
    <>
      <ElevationScroll elevationColor="#26041d" trigger={trigger}>
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
                  <Link
                    key={ruta.href + ruta.label}
                    href={ruta.href}
                    style={{ textDecoration: 'none' }}
                    onClick={() => setRutaActiva(ruta.href)}
                  >
                    <Typography
                      className={styles.toolbarLinks}
                      color={
                        trigger
                          ? 'white'
                          : !!usuario?.idUsuario
                          ? theme.palette.text.primary
                          : 'white'
                      }
                      variant="h6"
                      fontWeight={
                        rutaActiva === ruta.href ? 'bolder' : 'normal'
                      }
                    >
                      {ruta.label}
                    </Typography>
                  </Link>
                ))}
              </Container>
              <div>
                <IconButton
                  size="large"
                  edge="start"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon
                    size="large"
                    aria-label="menu de gestión de la cuenta"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    sx={{
                      color: trigger
                        ? 'white'
                        : !!usuario?.idUsuario
                        ? theme.palette.text.primary
                        : 'white',
                    }}
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
                  <MenuItem onClick={() => setCambiarPFPModalAbierto(true)}>
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
      </ElevationScroll>
      <Toolbar />
      {children}
      <Dialog
        open={cambiarPFPModalAbierto}
        onClose={() => setCambiarPFPModalAbierto(false)}
      >
        <DialogTitle>Cambiar foto de perfil</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <ButtonUploadImagen
              imagen={fotoDePerfil}
              setImagen={(imagen) => setFotoDePerfil(imagen)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCambiarPFPModalAbierto(false)}>
            Cancelar
          </Button>
          <Button onClick={() => cambiarFotoDePerfil(fotoDePerfil)}>
            Cambiar foto de perfil
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export { NavBarLayout };
