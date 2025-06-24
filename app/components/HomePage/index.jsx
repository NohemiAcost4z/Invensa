'use client';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './HomePage.module.scss';
import { useEstadoApp } from '../../context/EstadoAppContext';

export function HomePageComponent() {
  const router = useRouter();
  const theme = useTheme();
  const [loginFailed, setLoginFailed] = useState(false);
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const { setUsuario } = useEstadoApp();

  const iniciarSesion = async (datosDeInicio) => {
    const response = await fetch('api/login', {
      method: 'POST',
      body: JSON.stringify(datosDeInicio),
    });
    const usuario = await response.json().catch(() => setLoginFailed(true));
    if (!!usuario?.usuario?.idUsuario) {
      setUsuario(usuario?.usuario);
      redirect('/productos');
    } else {
      setLoginFailed(true);
    }
  };

  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = theme.palette.primary.main;

    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, [theme.palette.primary.main]);

  return (
    <Box className={styles.container}>
      <Grid
        container
        columns={2}
        spacing={20}
        direction="row"
        alignItems="center"
      >
        <Box className={styles.logo}>
          <Image
            src="logo-invensa.svg"
            width={400}
            height={400}
            alt="Logotipo de Invensa"
          />
          <Typography variant="h1" className={styles.titulo}>
            INVENSA
          </Typography>
          <Typography variant="subtitle1" color="#d46a92">
            GESTIÓN DE INVENTARIO
          </Typography>
        </Box>
        <Paper className={styles.paperInicioDeSesion}>
          <Container>
            <Stack spacing={1}>
              <Typography
                variant="h2"
                sx={{ textAlign: 'middle' }}
                fontSize={36}
              >
                Iniciar sesión
              </Typography>
              <TextField
                label="Correo"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                variant="filled"
              />
              <TextField
                label="Contraseña"
                type="password"
                value={contrasenia}
                onChange={(event) => setContrasenia(event.target.value)}
                variant="filled"
              />
              <Button
                onClick={() => iniciarSesion({ correo, contrasenia })}
                variant="contained"
              >
                Iniciar sesión
              </Button>
              <Button
                onClick={() => router.push('/registrarse')}
                variant="contained"
              >
                Registrarse
              </Button>
              {loginFailed && (
                <Typography variant="caption" color="error">
                  No se pudo iniciar sesión, verifica tu correo y Contraseña
                </Typography>
              )}
            </Stack>
          </Container>
        </Paper>
      </Grid>
    </Box>
  );
}

export { HomePageComponent };
