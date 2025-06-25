'use client';

import {
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { LoggedInLayout } from '../components/layouts/LoggedInLayout';
import { useEffect, useState } from 'react';

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState([]);

  const formateadorFecha = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const leerMovimientos = async () => {
    const response = await fetch('api/movimientos', {
      credentials: 'include',
    });
    const movimientos = await response.json();
    setMovimientos(movimientos);
  };

  useEffect(() => {
    leerMovimientos();
  }, []);

  return (
    <LoggedInLayout>
      <Container>
        <Stack>
          <Typography variant="h2">Movimientos</Typography>
        </Stack>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo de actualización</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Cantidad mínima</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movimientos.map((movimiento) => (
                <TableRow key={movimiento.idActualizacion}>
                  <TableCell>{movimiento.tipo}</TableCell>
                  <TableCell>{movimiento.nombreProducto}</TableCell>
                  <TableCell>{movimiento.cantidad}</TableCell>
                  <TableCell>{movimiento.cantidadMinima}</TableCell>
                  <TableCell>
                    {formateadorFecha.format(new Date(movimiento.fecha))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </LoggedInLayout>
  );
}
