'use client';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { NavBarLayout } from '../components/layouts/NavBarLayout';
import { useEstadoApp } from '../context/EstadoAppContext';
import { useState } from 'react';
import { redirect } from 'next/navigation';

export default function InicioSesionPage() {
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
      redirect('/');
    } else {
      setLoginFailed(true);
    }
  };

  return (
    <NavBarLayout>
      <Typography variant="h2">Iniciar sesión</Typography>
      <Paper>
        <TextField
          title="Correo"
          value={correo}
          onChange={(event) => setCorreo(event.target.value)}
        />
        <TextField
          title="Contraseña"
          type="password"
          value={contrasenia}
          onChange={(event) => setContrasenia(event.target.value)}
        />
        <Button onClick={() => iniciarSesion({ correo, contrasenia })}>
          Iniciar sesión
        </Button>
        {loginFailed && (
          <Typography variant="caption" color="error">
            No se pudo iniciar sesión, verifica tu correo y Contraseña
          </Typography>
        )}
      </Paper>
    </NavBarLayout>
  );
}
