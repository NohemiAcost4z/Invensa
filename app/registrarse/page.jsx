'use client';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';

const nuevoUsuarioReducer = (state, action) => {
  switch (action.type) {
    case 'cambiar_nombre':
      return {
        ...state,
        nombreUsuario: action.payload,
      };
    case 'cambiar_correo':
      return {
        ...state,
        correo: action.payload,
      };
    case 'cambiar_contrasenia':
      return {
        ...state,
        contrasenia: action.payload,
      };
  }
};

export default function RegistrarsePage() {
  const theme = useTheme();
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const [nuevoUsuario, dispatch] = useReducer(nuevoUsuarioReducer, {
    nombreUsuario: '',
    correo: '',
    contrasenia: '',
  });

  const crearUsuario = async () => {
    try {
      await fetch('api/usuario/registrar', {
        method: 'POST',
        body: JSON.stringify({ ...nuevoUsuario }),
      });
      router.push('/');
    } catch {
      setIsError(true);
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
    <>
      <Container>
        <Typography variant="h2" color="white">
          Crear Nuevo Usuario
        </Typography>
        <Paper sx={{ paddingX: 5, paddingY: 7, justifyContent: 'center' }}>
          <Stack gap={2}>
            <TextField
              label="Nombre"
              value={nuevoUsuario.nombreUsuario}
              onChange={(event) =>
                dispatch({
                  type: 'cambiar_nombre',
                  payload: event.target.value,
                })
              }
            />
            <TextField
              label="Correo"
              value={nuevoUsuario.correo}
              onChange={(event) =>
                dispatch({
                  type: 'cambiar_correo',
                  payload: event.target.value,
                })
              }
            />
            <TextField
              label="Contraseña"
              type="password"
              value={nuevoUsuario.contrasenia}
              onChange={(event) =>
                dispatch({
                  type: 'cambiar_contrasenia',
                  payload: event.target.value,
                })
              }
            />
            {isError && (
              <Typography variant="h6" color="error">
                La creación del usuario falló
              </Typography>
            )}
            <Box textAlign="center">
              <Button
                disabled={Object.values(nuevoUsuario).includes('')}
                onClick={() => crearUsuario()}
                variant="contained"
                size="large"
              >
                Crear usuario
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
