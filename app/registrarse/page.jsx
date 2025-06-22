'use client';
import {
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { NavBarLayout } from '../components/layouts/NavBarLayout';
import { useReducer, useState } from 'react';
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
      router.push('/inicio-sesion');
    } catch {
      setIsError(true);
    }
  };

  return (
    <NavBarLayout>
      <Typography variant="h2">Crear Nuevo Usuario</Typography>
      <Paper sx={{ padding: '1em 1.5em' }}>
        <Container>
          <Stack gap={2} marginBottom={2}>
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
          </Stack>
          <Button
            disabled={Object.values(nuevoUsuario).includes('')}
            onClick={() => crearUsuario()}
            variant="contained"
          >
            Crear usuario
          </Button>
        </Container>
      </Paper>
    </NavBarLayout>
  );
}
