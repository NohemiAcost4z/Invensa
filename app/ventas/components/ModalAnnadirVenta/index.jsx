import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import { useReducer, useState } from 'react';
import { SelectProducto } from '../../../components/SelectProducto';
import { DateSelector } from '../../../components/DateSelector';
import styles from './ModalAnnadirVenta.module.scss';

const ventaAAnnadirReducer = (state, action) => {
  switch (action.type) {
    case 'cambiar_cliente':
      return {
        ...state,
        cliente: { ...state.cliente, nombreCliente: action.payload },
      };
    case 'cambiar_producto':
      return { ...state, idProducto: action.payload };
    case 'cambiar_cantidad':
      return { ...state, cantidad: action.payload };
    case 'cambiar_fecha':
      return { ...state, fechaVenta: action.payload };
    case 'cambiar_correo':
      return {
        ...state,
        cliente: { ...state.cliente, correo: action.payload },
      };
    case 'cambiar_telefono':
      return {
        ...state,
        cliente: { ...state.cliente, telefono: action.payload },
      };
  }
};

function ModalAnnadirVenta({ open, onClose, onCrear }) {
  const [error, setError] = useState('');
  const [notificando, setNotificando] = useState('');
  const [ventaAAnnadir, dispatch] = useReducer(ventaAAnnadirReducer, {
    cliente: {
      nombreCliente: '',
      correo: '',
      telefono: '',
    },
    idProducto: '',
    cantidad: '',
    fechaVenta: '',
  });
  const [estaCreandoVenta, setEstaCreandoVenta] = useState(false);

  const crearNuevaVenta = async (ventaAAnnadir) => {
    setEstaCreandoVenta(true);
    await fetch('api/ventas', {
      method: 'POST',
      body: JSON.stringify({ ...ventaAAnnadir }),
      credentials: 'include',
    });
    if (!response.ok) {
      setEstaCreandoAlerta(false);
      const error = await response.json();
      setNotificando(true);
      setError(error.message);
      return;
    }
    onCrear();
    setEstaCreandoVenta(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Añadir venta</DialogTitle>
      <DialogContent>
        <Stack spacing={2} paddingTop={1}>
          <TextField
            label="Cliente"
            value={ventaAAnnadir.nombreCliente}
            onChange={(event) =>
              dispatch({ type: 'cambiar_cliente', payload: event.target.value })
            }
          />
          <TextField
            label="Correo"
            value={ventaAAnnadir.correo}
            onChange={(event) =>
              dispatch({ type: 'cambiar_correo', payload: event.target.value })
            }
          />
          <TextField
            label="Teléfono"
            value={ventaAAnnadir.telefono}
            onChange={(event) =>
              dispatch({
                type: 'cambiar_telefono',
                payload: event.target.value,
              })
            }
          />
          <SelectProducto
            value={ventaAAnnadir.idProducto}
            onChange={(event) => {
              dispatch({
                type: 'cambiar_producto',
                payload: event.target.value,
              });
            }}
          />
          <TextField
            label="Cantidad"
            inputMode="numeric"
            type="number"
            value={ventaAAnnadir.cantidad}
            slotProps={{ htmlInput: { className: styles.stockInput } }}
            onChange={(event) =>
              dispatch({
                type: 'cambiar_cantidad',
                payload: event.target.value,
              })
            }
          ></TextField>
        </Stack>
        <DateSelector
          marginTop={4}
          value={ventaAAnnadir.fechaVenta}
          onChange={(event) =>
            dispatch({
              type: 'cambiar_fecha',
              payload: event.target.value,
            })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={() => crearNuevaVenta(ventaAAnnadir)}
          loading={estaCreandoVenta}
          variant="contained"
        >
          Añadir producto
        </Button>
      </DialogActions>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={notificando}
        autoHideDuration={5000}
        onClose={() => setNotificando(false)}
      >
        <Alert
          onClose={() => setNotificando(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export { ModalAnnadirVenta };
