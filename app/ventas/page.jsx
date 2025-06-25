'use client';
import {
  Box,
  Button,
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
import styles from './page.module.scss';
import { ModalAnnadirVenta } from './components/ModalAnnadirVenta';

export default function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [modalAnnadirVentaAbierto, setModalAnnadirVentaAbierto] =
    useState(false);

  const formateadorFecha = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const colombianPeso = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  const cargarVentas = async () => {
    const response = await fetch('/api/ventas/obtenerVentas', {
      credentials: 'include',
    });
    const data = await response.json();
    setVentas(data);
  };

  const handleClose = () => {
    setModalAnnadirVentaAbierto(false);
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  return (
    <LoggedInLayout>
      <Container>
        <Stack spacing={3}>
          <Box className={styles.header}>
            <Typography variant="h2">Ventas</Typography>
            <Button
              variant="contained"
              onClick={() => setModalAnnadirVentaAbierto(true)}
            >
              Registrar venta
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto vendido</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>nombre del cliente</TableCell>
                  <TableCell>Fecha de venta</TableCell>
                  <TableCell>Valor de venta</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ventas.map((venta) => (
                  <TableRow
                    key={venta.idVenta}
                    sx={{ '&:last-child td, &:last-child th': { margin: 0.2 } }}
                  >
                    <TableCell>{venta.producto.nombre}</TableCell>
                    <TableCell>{venta.cantidad}</TableCell>
                    <TableCell>{venta.nombreCliente}</TableCell>
                    <TableCell>
                      {formateadorFecha.format(Date.parse(venta.fechaVenta))}
                    </TableCell>
                    <TableCell>
                      {colombianPeso.format(
                        venta.cantidad * venta.producto.precio
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Container>
      <ModalAnnadirVenta
        open={modalAnnadirVentaAbierto}
        onClose={handleClose}
        onCrear={() => cargarVentas()}
      />
    </LoggedInLayout>
  );
}
