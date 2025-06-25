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
  Tooltip,
  Typography,
} from '@mui/material';
import { LoggedInLayout } from '../components/layouts/LoggedInLayout';
import { useEffect, useState } from 'react';
import { ModalAnnadirAlerta } from './components/ModalAnnadirAlerta';
import styles from './page.module.scss';

export default function AlertaStock() {
  const [alertas, setAlertas] = useState([]);
  const [ModalAnnadirAlertaAbierto, setModalAnnadirAlertaAbierto] =
    useState(false);

  const formateadorFecha = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const valoresPorEstado = {
    Pendiente: { color: 'warning', label: 'Pendiente' },
    Atendida: { color: 'success', label: 'Atendida' },
  };

  const cargarAlertas = async () => {
    const response = await fetch('api/alertas/obtenerAlertas', {
      credentials: 'include',
    });
    const alertas = await response.json();
    setAlertas(alertas);
  };

  useEffect(() => {
    cargarAlertas();
  }, []);

  return (
    <LoggedInLayout>
      <Container>
        <Stack spacing={4}>
          <Box className={styles.titleContainer}>
            <Typography variant="h2">Alertas de stock</Typography>
            <Button
              variant="contained"
              onClick={() => setModalAnnadirAlertaAbierto(true)}
            >
              Agregar alerta
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Cantidad mínima</TableCell>
                  <TableCell>Fecha de Alerta</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alertas.map((alerta) => (
                  <TableRow key={alerta.idAlerta}>
                    <TableCell>{alerta.producto.nombreProducto}</TableCell>
                    <TableCell>{alerta.cantidadMinima}</TableCell>
                    <TableCell>
                      {alerta.fechaAlerta
                        ? formateadorFecha.format(new Date(alerta.fechaAlerta))
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Las alertas se toman por atendidas si el stock supera el mínimo definido">
                        <Typography
                          fontWeight="bold"
                          fontSize={18}
                          color={valoresPorEstado[alerta.estado].color}
                        >
                          {valoresPorEstado[alerta.estado].label}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Container>
      <ModalAnnadirAlerta
        open={ModalAnnadirAlertaAbierto}
        onClose={() => setModalAnnadirAlertaAbierto(false)}
        onCrear={() => cargarAlertas()}
      />
    </LoggedInLayout>
  );
}
